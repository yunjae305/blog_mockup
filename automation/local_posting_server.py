import threading
import traceback
from datetime import datetime

from flask import Flask, jsonify, request

from naver_auto_post import create_driver, ensure_naver_session, open_naver_login_session, paste_blog_post


app = Flask(__name__)
jobs = {}


@app.route("/", methods=["GET"])
def index():
    return """
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>AIONA Posting Automation</title>
        <style>
          body { margin: 40px; font-family: Arial, sans-serif; line-height: 1.6; }
          code { background: #f1f1f1; padding: 2px 6px; }
        </style>
      </head>
      <body>
        <h1>로컬 포스팅 자동화 서버 실행 중</h1>
        <p>이 주소는 브라우저에서 직접 사용하는 화면이 아니라, 블로그 목업의 <b>포스팅 시작</b> 버튼이 호출하는 로컬 API 서버입니다.</p>
        <p>네이버 자동 로그인 API: <code>POST /api/naver/post</code></p>
        <p>블로그 목업 화면으로 돌아가서 원고 생성 후 <b>포스팅 시작</b>을 눌러주세요.</p>
      </body>
    </html>
    """


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response


@app.route("/api/naver/post", methods=["POST", "OPTIONS"])
def start_naver_post():
    if request.method == "OPTIONS":
        return ("", 204)

    payload = request.get_json(silent=True) or {}
    user_id = (payload.get("id") or "").strip()
    password = payload.get("password") or ""
    title = payload.get("title") or ""
    body = payload.get("body") or ""
    mode = payload.get("postingMode") or "즉시 포스팅"
    delay_minutes = payload.get("delayMinutes") or 0

    job_id = datetime.now().strftime("%Y%m%d%H%M%S%f")
    jobs[job_id] = {"status": "running", "message": "네이버 세션 브라우저를 열고 있습니다."}

    thread = threading.Thread(
        target=run_naver_job,
        args=(job_id, user_id, password, title, body, mode, delay_minutes),
        daemon=True,
    )
    thread.start()

    return jsonify({"ok": True, "jobId": job_id, "message": jobs[job_id]["message"]}), 202


@app.route("/api/naver/session", methods=["POST", "OPTIONS"])
def open_naver_session():
    if request.method == "OPTIONS":
        return ("", 204)

    job_id = datetime.now().strftime("%Y%m%d%H%M%S%f")
    jobs[job_id] = {"status": "running", "message": "네이버 로그인 세션 창을 열고 있습니다."}
    thread = threading.Thread(target=run_naver_session_job, args=(job_id,), daemon=True)
    thread.start()
    return jsonify({"ok": True, "jobId": job_id, "message": jobs[job_id]["message"]}), 202


def run_naver_session_job(job_id):
    try:
        driver = create_driver(detach=True)
        open_naver_login_session(driver)
        message = "네이버 로그인 창을 열었습니다. 열린 크롬에서 직접 로그인하면 세션이 저장됩니다."
        jobs[job_id] = {"status": "done", "message": message}
        print(message)
    except Exception as exc:
        message = f"네이버 세션 창 열기 실패: {exc}"
        jobs[job_id] = {"status": "failed", "message": message, "traceback": traceback.format_exc()}
        print(message)
        print(jobs[job_id]["traceback"])


def run_naver_job(job_id, user_id, password, title, body, mode, delay_minutes):
    driver = None
    try:
        driver = create_driver(detach=True)
        logged_in = ensure_naver_session(driver, user_id, password)
        if not logged_in:
            jobs[job_id] = {"status": "waiting", "message": "네이버 로그인을 완료하면 포스팅을 다시 시작해주세요."}
            return
        pasted = paste_blog_post(driver, title, body)

        if mode == "예약 포스팅":
            message = f"네이버 로그인 후 글쓰기 화면을 열었습니다. {delay_minutes}분 뒤 예약 설정은 열린 화면에서 확인하세요."
        elif pasted:
            message = "네이버 로그인 후 글쓰기 화면에 원고를 붙여넣었습니다."
        else:
            message = "네이버 로그인 후 글쓰기 화면을 열었습니다. 원고는 클립보드에 복사되었습니다."

        jobs[job_id] = {"status": "done", "message": message}
        print(message)
    except Exception as exc:
        message = f"네이버 자동 포스팅 실패: {exc}"
        jobs[job_id] = {
            "status": "failed",
            "message": message,
            "traceback": traceback.format_exc(),
        }
        print(message)
        print(jobs[job_id]["traceback"])


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=29123, debug=False, threaded=True, use_reloader=False)
