const fieldLabels = {
    name: "Név",
    phone: "Telefonszám",
    email: "Email cím",
    date: "Dátum",
    time: "Időpont",
    guests: "Vendégek száma",
    location: "Asztal típusa",
    options: "Különleges igények",
    party_color: "Dekoráció színe",
    message: "Megjegyzés",
    agree: "Adatvédelmi hozzájárulás"
};

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("data");

    const type = sessionStorage.getItem("formType");
    const rawData = sessionStorage.getItem("formData");

    if (!rawData) {
        container.innerHTML = "<p>Nincs megjeleníthető adat.</p>";
        return;
    }

    const data = JSON.parse(rawData);

    const title = document.getElementById("title");
    title.innerText = type === "reservation" 
        ? "Köszönjük foglalását!" 
        : "Köszönjük üzenetét!";

    const list = document.createElement("div");
    list.setAttribute("class", "row");

    for (const key in data) {
        if (key === "agree") {
            continue;
        }

        const block = document.createElement("div");
        block.setAttribute("class", "col-lg-3");

        const label = document.createElement("h3");
        label.innerText = fieldLabels[key];

        block.appendChild(label);

        if (Array.isArray(data[key])) {
            const ul = document.createElement("ul");
            data[key].forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                ul.appendChild(li);
            });
            block.appendChild(ul);
        }
        else {
            const value = document.createElement("p");
            value.innerText = data[key];
            block.appendChild(value);
        }

        list.appendChild(block);
    }

    container.appendChild(list);
});