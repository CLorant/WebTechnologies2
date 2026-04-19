function populateWeeklyMenu() {
    $.ajax({
        url: "http://localhost:5000/api/weekly-menu",
        method: "GET",
        dataType: "json",

        success: (menu) => {
            const rows = document.querySelectorAll('.weekly-menu-table tbody tr');

            menu.forEach((day, i) => {
                rows[0].querySelectorAll('td span')[i].textContent = day["A"];
                rows[1].querySelectorAll('td span')[i].textContent = day["B"];
                rows[2].querySelectorAll('td span')[i].textContent = day["C"];
                rows[3].querySelectorAll('td')[i].textContent = day["dessert"];
            });
        },

        error: (error) => {
            console.error("Hiba történt a menü betöltésekor:", error);
        }
    });
}

document.addEventListener('DOMContentLoaded', populateWeeklyMenu);