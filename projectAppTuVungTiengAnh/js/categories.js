document.addEventListener("DOMContentLoaded", () => {
    // Lấy phần thân bảng, ô tìm kiếm và nút "Thêm danh mục"
    let categoryTableBody = document.querySelector("tbody");
    let searchInput = document.querySelector(".search-bar");
    let addButton = document.querySelector(".btn-green");

    // Mảng lưu danh sách danh mục
    let categories = [];

    // Phân trang
    let currentPage = 1;
    let itemsPerPage = 5;

    // Hàm hiển thị bảng danh mục
    function renderTable(data) {
        categoryTableBody.innerHTML = "";
        let start = (currentPage - 1) * itemsPerPage;
        let paginatedData = data.slice(start, start + itemsPerPage);

        paginatedData.forEach((cat, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cat.name}</td>
                <td>${cat.description}</td>
                <td>
                    <button onclick="editCategory(${index + start})">Sửa</button>
                    <button onclick="deleteCategory(${index + start})">Xoá</button>
                </td>
            `;
            categoryTableBody.appendChild(row);
        });
    }

    // Cập nhật bảng khi có thay đổi
    function updateTable() {
        let filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        renderTable(filtered);
    }

    // Sửa danh mục
    window.editCategory = (index) => {
        let cat = categories[index];
        let newName = prompt("Sửa tên danh mục:", cat.name);
        let newDesc = prompt("Sửa mô tả:", cat.description);
        if (newName !== null) {
            categories[index].name = newName;
            categories[index].description = newDesc;
            updateTable();
        }
    };

    // Xoá danh mục
    window.deleteCategory = (index) => {
        if (confirm("Bạn có chắc muốn xoá danh mục này không?")) {
            categories.splice(index, 1);
            updateTable();
        }
    };

    // Thêm danh mục mới
    addButton.addEventListener("click", () => {
        let name = prompt("Nhập tên danh mục:");
        if (!name) return;
        const description = prompt("Nhập mô tả (không bắt buộc):");
        categories.push({ name, description: description || "" });
        updateTable();
    });

    // Lọc khi tìm kiếm
    searchInput.addEventListener("input", updateTable);

    // Dữ liệu mẫu ban đầu để test
    categories = [
        { name: "Động vật", description: "Từ vựng liên quan đến động vật" },
        { name: "Thức ăn", description: "Các món ăn phổ biến" },
        { name: "Du lịch", description: "Từ vựng dùng khi đi du lịch" },
        { name: "Công nghệ", description: "Từ vựng về công nghệ" },
        { name: "Thiên nhiên", description: "Thiên nhiên và môi trường" },
        { name: "Nghề nghiệp", description: "Các ngành nghề" }
    ];
    // Tạo các nút phân trang
    let paginationContainer = document.createElement("div");
    paginationContainer.style.textAlign = "center";
    paginationContainer.style.marginTop = "20px";
    let prevBtn = document.createElement("button");
    prevBtn.textContent = "Trang trước";
    prevBtn.style.marginRight = "10px";
    let nextBtn = document.createElement("button");
    nextBtn.textContent = "Trang sau";
    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(nextBtn);
    document.querySelector(".container").appendChild(paginationContainer);
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
        }
    });
    nextBtn.addEventListener("click", () => {
        let filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        if (currentPage * itemsPerPage < filtered.length) {
            currentPage++;
            updateTable();
        }
    });
    // Gọi hàm hiển thị lần đầu
    updateTable();
});
