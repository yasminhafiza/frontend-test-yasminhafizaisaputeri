 // Mengambil referensi elemen dropdown
 const itemsPerPageDropdown = document.querySelector('#itemsPerPageDropdown');
 const sortByDropdown = document.querySelector('#sortByDropdown');

 // Menangani klik pada item "Show per page"
 document.querySelectorAll('#itemsPerPageDropdown + .dropdown-menu .dropdown-item').forEach(item => {
     item.addEventListener('click', function (event) {
         event.preventDefault(); // Mencegah aksi default dari link
         const value = this.getAttribute('data-value');
         itemsPerPageDropdown.textContent = value; // Mengubah teks tombol dropdown
         // Tambahkan logika tambahan untuk memperbarui tampilan dengan jumlah item per halaman yang dipilih
         updateItemsPerPage(value);
     });
 });

 // Menangani klik pada item "Sort by"
 document.querySelectorAll('#sortByDropdown + .dropdown-menu .dropdown-item').forEach(item => {
     item.addEventListener('click', function (event) {
         event.preventDefault(); // Mencegah aksi default dari link
         const value = this.getAttribute('data-value');
         sortByDropdown.textContent = this.textContent; // Mengubah teks tombol dropdown
         // Tambahkan logika tambahan untuk memperbarui tampilan dengan urutan yang dipilih
         updateSortOrder(value);
     });
 });

 // Fungsi untuk memperbarui jumlah item per halaman
 function updateItemsPerPage(value) {
     console.log('Items per page set to:', value);
     // Tambahkan kode untuk memperbarui tampilan atau permintaan data berdasarkan nilai ini
 }

 // Fungsi untuk memperbarui urutan
 function updateSortOrder(value) {
     console.log('Sorting by:', value);
     // Tambahkan kode untuk memperbarui tampilan atau permintaan data berdasarkan nilai ini
 }

// Fungsi untuk memperbarui halaman aktif
function updateActivePage(pageNumber) {
    // Hapus class 'active' dari halaman yang sebelumnya aktif
    document.querySelector('.pagination .page-item.active').classList.remove('active');

    // Tambahkan class 'active' pada halaman yang baru dipilih
    const newActivePage = [...document.querySelectorAll('.pagination .page-item')]
        .find(item => item.textContent.trim() === pageNumber);

    if (newActivePage) {
        newActivePage.classList.add('active');
    }
}




document.addEventListener('DOMContentLoaded', () => {
    // Variabel untuk mengatur header scroll
    let lastScrollTop = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset;

        if (currentScroll > lastScrollTop) {
            // Scroll ke bawah
            header.classList.remove('visible');
            header.classList.add('hidden');
        } else {
            // Scroll ke atas
            header.classList.remove('hidden');
            header.classList.add('visible');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Menjaga nilai scroll di bawah 0

        // Update efek parallax saat scroll
        const scrollPosition = window.pageYOffset;
        const bannerImage = document.querySelector('.banner-image img');
        const bannerText = document.querySelector('.banner-text');

        if (bannerImage) {
            bannerImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
        if (bannerText) {
            bannerText.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        }
    });

    // Mengatur menu aktif
    const currentPagePath = window.location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll('.menu a');

    menuItems.forEach(item => {
        if (item.getAttribute('href') === currentPagePath) {
            item.classList.add('active');
        }
    });

    // Mengatur item per halaman dan sortir
    let itemsPerPage = localStorage.getItem('itemsPerPage') ? parseInt(localStorage.getItem('itemsPerPage')) : 10;
    let sortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : 'newest';

    const itemsPerPageDropdown = document.getElementById('itemsPerPageDropdown');
    const sortByDropdown = document.getElementById('sortByDropdown');

    // Initialize dropdowns
    itemsPerPageDropdown.querySelector('.btn').innerHTML = `${itemsPerPage} items per page <i class="fas fa-caret-down"></i>`;
    sortByDropdown.querySelector('.btn').innerHTML = `${sortBy} <i class="fas fa-caret-down"></i>`;

    // Handle dropdown selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = item.closest('.dropdown');
            const button = dropdown.querySelector('.btn');
            button.innerHTML = `${item.textContent} <i class="fas fa-caret-down"></i>`;
            if (dropdown.id === 'itemsPerPageDropdown') {
                itemsPerPage = parseInt(item.getAttribute('data-value'));
                localStorage.setItem('itemsPerPage', itemsPerPage);
            } else if (dropdown.id === 'sortByDropdown') {
                sortBy = item.getAttribute('data-value');
                localStorage.setItem('sortBy', sortBy);
            }
            loadPosts(); // Load posts with new settings
        });
    });

    // Fungsi untuk memuat postingan
    function loadPosts(page = 1) {
        const url = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${itemsPerPage}&append[]=small_image&append[]=medium_image&sort=${sortBy === 'newest' ? '-published_at' : 'published_at'}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const cardsContainer = document.getElementById('cards-container');
                const pagination = document.getElementById('pagination');
                cardsContainer.innerHTML = '';
                pagination.innerHTML = '';

                data.data.forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${post.small_image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body">
                            <p class="card-date">${new Date(post.published_at).toLocaleDateString()}</p>
                            <p class="card-text">${post.title}</p>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                });

                // Generate pagination
                const totalPages = data.meta.total_pages;
                const paginationList = document.createElement('ul');
                paginationList.className = 'pagination-list';

                const prevButton = document.createElement('li');
                prevButton.className = 'page-item';
                prevButton.innerHTML = `<a href="#" class="page-link">«</a>`;
                paginationList.appendChild(prevButton);

                for (let i = 1; i <= totalPages; i++) {
                    const pageItem = document.createElement('li');
                    pageItem.className = `page-item ${i === page ? 'active' : ''}`;
                    pageItem.innerHTML = `<a href="#" class="page-link">${i}</a>`;
                    paginationList.appendChild(pageItem);
                }

                const nextButton = document.createElement('li');
                nextButton.className = 'page-item';
                nextButton.innerHTML = `<a href="#" class="page-link">»</a>`;
                paginationList.appendChild(nextButton);

                pagination.appendChild(paginationList);

                // Add click event listener for pagination
                document.querySelectorAll('.page-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const text = link.textContent.trim();
                        if (text === '«') {
                            if (currentPage > 1) {
                                currentPage--;
                                loadPosts(currentPage);
                            }
                        } else if (text === '»') {
                            if (currentPage < totalPages) {
                                currentPage++;
                                loadPosts(currentPage);
                            }
                        } else {
                            const pageNumber = parseInt(text);
                            if (!isNaN(pageNumber)) {
                                currentPage = pageNumber;
                                loadPosts(currentPage);
                            }
                        }
                    });
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    loadPosts();
    header.classList.add('visible');
});
