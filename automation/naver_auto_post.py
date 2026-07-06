import argparse
import os
import sys
import time
from pathlib import Path
from urllib.parse import quote

import pyautogui
import pyperclip
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


NAVER_WRITE_URL = "https://blog.naver.com/GoBlogWrite.naver"
NAVER_LOGIN_URL = (
    "https://nid.naver.com/nidlogin.login?mode=form&url="
    + quote(NAVER_WRITE_URL, safe="")
)
DEFAULT_PROFILE_DIR = Path(__file__).resolve().parent / "chrome_profile"


def create_driver(detach=True, user_data_dir=None):
    options = Options()
    if detach:
        options.add_experimental_option("detach", True)

    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    profile_dir = Path(user_data_dir or DEFAULT_PROFILE_DIR).resolve()
    profile_dir.mkdir(parents=True, exist_ok=True)
    options.add_argument(f"--user-data-dir={profile_dir}")
    options.add_argument("--profile-directory=Default")
    options.add_argument("--start-maximized")

    try:
        from webdriver_manager.chrome import ChromeDriverManager

        return webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options,
        )
    except Exception:
        return webdriver.Chrome(options=options)


def paste_text(element, text, retries=3):
    for _ in range(retries):
        pyperclip.copy(text)
        element.parent.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        element.parent.execute_script("arguments[0].focus();", element)
        element.click()
        time.sleep(0.2)
        element.send_keys(Keys.CONTROL, "a")
        time.sleep(0.2)
        element.send_keys(Keys.CONTROL, "v")
        time.sleep(1.2)

        current_value = element.get_attribute("value") or ""
        if current_value == text:
            return True

        element.parent.execute_script("arguments[0].focus();", element)
        time.sleep(0.2)
        pyautogui.hotkey("ctrl", "a")
        time.sleep(0.2)
        pyautogui.hotkey("ctrl", "v")
        time.sleep(1.2)

        current_value = element.get_attribute("value") or ""
        if current_value == text:
            return True

    return False


def wait_for_manual_login(driver, timeout=300):
    print("Waiting for manual Naver login/captcha completion...")
    try:
        WebDriverWait(driver, timeout).until(lambda d: "nid.naver.com" not in d.current_url)
        return True
    except TimeoutException:
        return False


def open_naver_login_session(driver):
    driver.get(NAVER_LOGIN_URL)
    return True


def ensure_naver_session(driver, user_id="", password=""):
    driver.get(NAVER_WRITE_URL)
    time.sleep(2)
    if "nid.naver.com" not in driver.current_url:
        print("Existing Naver session detected.")
        return True

    if not user_id or not password:
        print("Naver session is missing. Complete login manually in the opened Chrome window.")
        return wait_for_manual_login(driver, timeout=300)

    driver.get(NAVER_LOGIN_URL)
    wait = WebDriverWait(driver, 20)

    id_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#id")))
    pw_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#pw")))

    id_pasted = paste_text(id_input, user_id)
    password_pasted = paste_text(pw_input, password)
    pyperclip.copy("")

    if not id_pasted or not password_pasted:
        print("ID/password paste failed. Login button was not clicked.")
        return wait_for_manual_login(driver, timeout=300)

    login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#log\\.login")))
    login_button.click()

    try:
        wait.until(lambda d: "nid.naver.com" not in d.current_url)
        return True
    except TimeoutException:
        print("Naver asked for captcha/2FA or blocked automated login.")
        print("Complete it manually in the opened Chrome window. The script will continue after login.")
        return wait_for_manual_login(driver)


def login_naver(driver, user_id, password):
    return ensure_naver_session(driver, user_id, password)


def read_text(path_or_text):
    if not path_or_text:
        return ""

    path = Path(path_or_text)
    if path.exists():
        return path.read_text(encoding="utf-8")
    return path_or_text


def find_in_frames(driver, selectors, timeout=12):
    end_at = time.time() + timeout
    while time.time() < end_at:
        driver.switch_to.default_content()

        for selector in selectors:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if elements:
                return elements[0]

        frames = driver.find_elements(By.CSS_SELECTOR, "iframe")
        for frame in frames:
            try:
                driver.switch_to.default_content()
                driver.switch_to.frame(frame)
                for selector in selectors:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        return elements[0]
            except Exception:
                continue

        time.sleep(0.5)

    driver.switch_to.default_content()
    return None


def paste_blog_post(driver, title, body):
    driver.get(NAVER_WRITE_URL)
    time.sleep(3)

    title_selectors = [
        "textarea[placeholder*='제목']",
        "input[placeholder*='제목']",
        "[contenteditable='true'][class*='title']",
        ".se-title-text",
    ]
    body_selectors = [
        ".se-section-text [contenteditable='true']",
        ".se-component-content [contenteditable='true']",
        "[contenteditable='true']",
        "textarea",
    ]

    title_element = find_in_frames(driver, title_selectors, timeout=8)
    if title_element and title:
        paste_text(title_element, title)

    body_element = find_in_frames(driver, body_selectors, timeout=12)
    if body_element and body:
        paste_text(body_element, body)
        return True

    if body:
        pyperclip.copy(body)
    return False


def parse_args():
    parser = argparse.ArgumentParser(description="Login to Naver and paste a blog draft.")
    parser.add_argument("--id", default=os.getenv("NAVER_ID", ""), help="Naver ID")
    parser.add_argument("--password", default=os.getenv("NAVER_PASSWORD", ""), help="Naver password")
    parser.add_argument("--title", default="", help="Post title")
    parser.add_argument("--body", default="", help="Post body text, or a path to a UTF-8 text file")
    parser.add_argument("--profile-dir", default=str(DEFAULT_PROFILE_DIR), help="Chrome user data directory for saved Naver session")
    parser.add_argument("--keep-open", action="store_true", help="Keep Chrome open after the script ends")
    return parser.parse_args()


def main():
    args = parse_args()
    if not args.id or not args.password:
        print("NAVER_ID/NAVER_PASSWORD or --id/--password is required.")
        return 1

    body = read_text(args.body)
    driver = create_driver(detach=args.keep_open, user_data_dir=args.profile_dir)

    try:
        logged_in = login_naver(driver, args.id, args.password)
        if not logged_in:
            print("Naver login was not completed.")
            return 1
        pasted = paste_blog_post(driver, args.title, body)
        if pasted:
            print("Naver blog editor opened and draft was pasted.")
        else:
            print("Editor opened, but automatic paste failed. Draft is copied to clipboard.")
        return 0
    except Exception as exc:
        print(f"Automation failed: {exc}")
        return 1
    finally:
        if not args.keep_open:
            time.sleep(2)
            driver.quit()


if __name__ == "__main__":
    sys.exit(main())
