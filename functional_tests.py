from selenium.webdriver import Firefox
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:
    def setup_method(self):
        self.browser = Firefox()

    def teardown_method(self):
        self.browser.quit()

    def test_login_open(self):
        self.browser.get("http://localhost:5500/")
        self.browser.find_element_by_id("LoginLink").click()
        assert "Login" in self.browser.find_element_by_class_name(
            "card-header").text

    def test_login_success(self):
        self.browser.get("http://localhost:5500/")
        self.browser.find_element_by_id("LoginLink").click()
        self.browser.find_element_by_id("existingUsername").send_keys("some")
        self.browser.find_element_by_id("existingPassword").send_keys("pass")
        self.browser.find_element_by_id("loginButton").click()
        WebDriverWait(self.browser, 10).until(
            EC.presence_of_element_located((By.ID, "startNewGame")))
        assert "some" in self.browser.find_element_by_class_name(
            "card-header").text
