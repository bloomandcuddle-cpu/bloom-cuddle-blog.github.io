document.getElementById("subscribe-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("mce-EMAIL").value;

    // Mailchimp JSONP endpoint
    const url =
      "https://gmail.us2.list-manage.com/subscribe/post-json?u=3fb474bb32938e63a769bb905&id=e02877e9b6&c=callback";

    // JSONP callback
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
