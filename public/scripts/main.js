(function setupAlertBox() {
    const main = document.querySelector("main");
    if (!main) return;
  
    const alertBox = document.createElement("div");
    alertBox.id = "global-alert";
    alertBox.style.position = "absolute";
    alertBox.style.top = "20px";
    alertBox.style.right = "20px";
    alertBox.style.zIndex = "5000";
    alertBox.style.display = "flex";
    alertBox.style.flexDirection = "column";
    alertBox.style.gap = "10px";
  
    const parent = main.parentElement;
    parent.style.position = "relative";
    parent.appendChild(alertBox);
  })();
  
  export function showAlert(message, type = "error", duration = 3000) {
    const box = document.getElementById("global-alert");
    if (!box) return;
  
    const el = document.createElement("div");
    el.className = "alert-item";
    el.textContent = message;
  
    el.style.padding = "10px 16px";
    el.style.borderRadius = "12px";
    el.style.fontSize = ".9rem";
    el.style.color = "#fff";
    el.style.opacity = "0.95";
    el.style.transition = "opacity .3s";
    el.style.background = type === "success" ? "#22c55e" : "#ef4444";
  
    box.appendChild(el);
  
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, duration);
  }
  if (window.axios) {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const data = error.response.data;
          if (data?.status === "unauthorized") {
            showAlert(data.message || "برای ادامه ابتدا وارد حساب شوید");
          }
          if (data?.message) {
            showAlert(data.message);
          }
        } else {
          showAlert("مشکل ارتباط با سرور");
        }
        return Promise.reject(error);
      }
    );
  }