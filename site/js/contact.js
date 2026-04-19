document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const dataObj = {};

        formData.forEach((value, key) => {
            dataObj[key] = value;
        });

        fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObj)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/koszonjuk.html";
            } else {
                alert("Hiba történt. Kérjük próbálja újra.");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Hálózati hiba.");
        });
    });
});