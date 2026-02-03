// 1. KONFIGURASI SUPABASE
const SUPABASE_URL = 'https://trhbfitkysiusemtwmsh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_-GyGSI-iWUgLCtAGXtidvg_FpDUrNn0'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. PEMUATAN DATA AWAL
let currentUser = localStorage.getItem('oml_user');

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    
    // Set nama jika sudah ada dalam simpanan
    if (currentUser && usernameInput) {
        usernameInput.value = currentUser;
    }

    // Panggil fungsi muat post
    loadPosts();

    // --- AKTIFKAN REALTIME LISTENER ---
    // Pastikan anda sudah klik "Enable Realtime" pada table 'posts' di Supabase Dashboard
    _supabase
        .channel('public:posts')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'posts' 
        }, (payload) => {
            console.log('Ada post baru masuk!', payload);
            loadPosts(); // Auto-refresh feed bila ada data baru
        })
        .subscribe();
});

// 3. FUNGSI HANTAR POST
async function handlePostSubmit() {
    const usernameInput = document.getElementById('username'); 
    const contentInput = document.getElementById('content');
    const btn = document.getElementById('postBtn');

    const user = usernameInput.value.trim() || "Anon";
    const content = contentInput.value.trim();

    if (!content) {
        alert("Sila tulis sesuatu...");
        return;
    }

    // Simpan nama untuk masa depan
    localStorage.setItem('oml_user', user);
    currentUser = user;

    // Loading status pada butang
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    // Masukkan data ke Supabase
    const { error } = await _supabase
        .from('posts')
        .insert([{ username: user, content: content }]);

    if (error) {
        console.error(error);
        alert("Gagal hantar: " + error.message);
    } else {
        // Kosongkan kotak teks (Nama dikekalkan)
        contentInput.value = '';
    }
    
    // Kembalikan butang ke asal
    btn.disabled = false;
    btn.innerText = "Post";
}

// 4. FUNGSI AMBIL POST (FEED)
async function loadPosts() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30); // Ambil 30 post terbaru sahaja

    const feed = document.getElementById('feed');
    if (!feed) return;

    if (error) {
        console.error("Ralat database:", error);
        return;
    }

    if (data) {
        if (data.length === 0) {
            feed.innerHTML = '<div class="text-center text-muted py-5">Dinding ini masih kosong. Mulakan bicara...</div>';
            return;
        }

        feed.innerHTML = data.map(post => `
            <div class="card mb-3 border-0 shadow-sm p-3 bg-white" style="border-radius: 18px; transition: 0.3s;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-primary small" style="letter-spacing: 0.5px;">@${post.username}</span>
                    <span class="text-muted" style="font-size: 0.7rem;">
                        ${new Date(post.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div class="text-dark" style="white-space: pre-wrap; font-size: 1rem; line-height: 1.4;">${post.content}</div>
            </div>
        `).join('');
    }
}

// 5. FUNGSI LOGOUT
function logout() {
    localStorage.removeItem('oml_user');
    location.reload();
}
