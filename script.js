// 1. 設定情報
const API_URL = "https://hituastronomy.microcms.io/api/v1/hituastronomy";
const API_KEY = "FKRpP8tDRfieNBybQxz1ypKmuBNM6RMdQKJ7";

// 2. ページ読み込み完了後に実行
window.addEventListener("load", () => {
    // 活動紹介ページなら全記事取得
    if (document.getElementById('activities-list')) {
        loadActivities();
    }
    // ホーム画面なら最新5件取得
    if (document.querySelector('.post-inner')) {
        loadHomeLatestPosts();
    }
    // アニメーション監視（静的コンテンツ用）
    initScrollObserve();
});

// 3. 全記事データを取ってくる関数（活動紹介ページ用）
async function loadActivities() {
    console.log("全記事通信開始..."); 
    try {
        const response = await fetch(API_URL, {
            headers: { "X-MICROCMS-API-KEY": API_KEY }
        });
        if (!response.ok) throw new Error(`HTTPエラー! status: ${response.status}`);
        const data = await response.json();
        displayActivities(data.contents);
    } catch (error) {
        console.error("エラー詳細:", error);
        const container = document.getElementById('activities-list');
        if (container) container.innerHTML = "データの取得に失敗しました。";
    }
}

// 4. ホーム用最新記事を取ってくる関数
async function loadHomeLatestPosts() {
    console.log("ホーム用通信開始...");
    try {
        const response = await fetch(`${API_URL}?limit=5`, {
            headers: { "X-MICROCMS-API-KEY": API_KEY }
        });
        const data = await response.json();
        displayHomePosts(data.contents);
    } catch (error) {
        console.error("ホーム記事取得エラー:", error);
    }
}

// 5. 活動紹介ページに表示する関数
function displayActivities(contents) {
    const listContainer = document.getElementById('activities-list');
    if (!listContainer) return;
    listContainer.innerHTML = "";

    contents.forEach((post) => {
        const entry = document.createElement('div');
        entry.className = 'activity-entry scroll-fade';

        // 日付処理：カスタム日付優先
        const rawDate = post.customDate ? post.customDate : post.publishedAt;
        const dateObj = new Date(rawDate);
        const dateString = `${dateObj.getFullYear()}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getDate().toString().padStart(2, '0')}`;

        // 画像URL処理
        let imageUrl = "images/main_logo.png"; 
        if (post.image && post.image.url) {
            imageUrl = post.image.url + "?fm=jpg"; 
        }

        entry.innerHTML = `
            <div class="entry-image">
                <img src="${imageUrl}" alt="${post.title}">
            </div>
            <div class="entry-body">
                <div class="entry-date">${dateString}</div>
                <h3 class="entry-title">${post.title}</h3>
                <div class="entry-text">${post.content}</div>
            </div>
        `;
        listContainer.appendChild(entry);
    });
    setTimeout(initScrollObserve, 100);
}

// 6. ホーム画面に表示する関数
function displayHomePosts(contents) {
    const homeContainer = document.querySelector('.post-inner');
    if (!homeContainer) return;
    homeContainer.innerHTML = "";

    contents.forEach(post => {
        const article = document.createElement('a');
        article.href = `activity_detail.html?id=${post.id}`;
        article.className = 'post-card scroll-fade';

        let imageUrl = "images/main_logo.png";
        if (post.image && post.image.url) {
            imageUrl = `${post.image.url}?w=600&h=800&fit=crop`;
        }

        article.innerHTML = `
            <div class="post-card-img" style="background-image: url('${imageUrl}') !important;"></div>
            <h3>${post.title}</h3>
        `;
        homeContainer.appendChild(article);
    });

    const moreBtn = document.createElement('a');
    moreBtn.href = "activities.html";
    moreBtn.className = "next-arrow";
    moreBtn.innerHTML = `<span>MORE</span>`;
    homeContainer.appendChild(moreBtn);

    initScrollObserve();
}

// 7. アニメーション監視関数
function initScrollObserve() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-fade, .activity-item').forEach(el => observer.observe(el));
}

// --- ハンバーガーメニューの動作 ---
window.addEventListener("load", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            // クラスを付け外しして、開閉を切り替える
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // メニューのリンクをクリックしたら閉じる（親切設計）
        const navLinks = navMenu.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }
});