// وظائف صفحة الهبوط
document.addEventListener('DOMContentLoaded', function() {
    // نموذج الإيميلشامب
    const subscribeForm = document.getElementById("subscribe-form");
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("mce-EMAIL").value;
            const url = "https://gmail.us2.list-manage.com/subscribe/post-json?u=3fb474bb32938e63a769bb905&id=e02877e9b6&c=callback";
            
            window.callback = function(response) {
                if (response.result === "success") {
                    window.location.href = "thank-you.html";
                } else {
                    alert("Please enter a valid email.");
                }
            };
            
            const script = document.createElement("script");
            script.src = `${url}&EMAIL=${encodeURIComponent(email)}`;
            document.body.appendChild(script);
        });
    }
    
    // وظائف التحميل في صفحة الشكر
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Your download will start now!');
        });
    });
});
