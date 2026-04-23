document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#reservation form");
    const timeInput = document.querySelector("#time");
    const timeLabel = document.querySelector("#timeLabel");
    const timeOptions = Array.from(document.querySelectorAll("#times option"))
        .map(opt => opt.value);
    const birthday = document.querySelector("#birthday");
    const colorWrapper = document.querySelector("#color-wrapper");

    birthday.addEventListener("change", () => {
        colorWrapper.classList.toggle("d-none");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedTime = timeInput.value.trim();
        if (!timeOptions.includes(selectedTime)) {
            timeLabel.classList.remove("d-none");
            timeInput.style = "border-color: red";
            return;
        }
        else {
            timeLabel.classList.add("d-none");
            timeInput.style = "";
        }

        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((value, key) => {
            if (key.endsWith("[]")) {
                const realKey = key.replace("[]", "");
                if (!dataObj[realKey]) dataObj[realKey] = [];
                dataObj[realKey].push(value);
            } else {
                dataObj[key] = value;
            }
        });

        if (birthday.checked) {
            const colorValue = colorWrapper.querySelector("input[type='color']").value;
            dataObj["party_color"] = colorValue;
        }

        fetch(`${window.BACKEND_URL}/api/reservation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataObj)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/koszonjuk.html";
                } else {
                    alert("Hiba a foglalás során.");
                }
            })
            .catch(err => {
                console.error(err);
                alert("Hálózati hiba.");
            });
    });
});