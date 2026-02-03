// ==========================================
// 1. KONFIGURASI SUPABASE (URL & KEY ANDA)
// ==========================================
const SUPABASE_URL = 'https://trhbfitkysiusmtwmsh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_-GyGSI-iWUgLCtAGXtidvg_FpDUrNn0'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. AMBIL DATA USER DARI STORAGE
let currentUser = localStorage.getItem('oml_user');

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    
    // Set nama jika sudah ada dalam simpanan browser
    if (currentUser && usernameInput) {
        usernameInput.value = currentUser;
    }

    // Muat post sedia ada sebaik sahaja web dibuka
    loadPosts();

    // ==========================================
    // 3. AKTIFKAN REALTIME (POST MUNCUL TERUS)
    // ==========================================
    _supabase
        .channel('public:posts')
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'posts' 
        }, (payload) => {
            console.log('Post baru dikesan!', payload);
            loadPosts(); // Refresh senarai post secara automatik
        })
        .subscribe();
});

// ==========================================
// 4. FUNGSI HANTAR POST (HANDLE SUBMIT)
// ==========================================
async function handlePostSubmit() {
    const usernameInput = document.getElementById('username'); 
    const contentInput = document.getElementById('content');
    const btn = document.getElementById('postBtn');

    const user = usernameInput.value.trim() || "Anon";
    const content = contentInput.value.trim();

    // Jangan hantar kalau kosong
    if (!content) {
        alert("Sila tulis sesuatu sebelum hantar!");
        return;
    }

    // Simpan nama user supaya tak payah taip lagi
    localStorage.setItem('oml_user', user);
    currentUser = user;

    // Tukar butang jadi loading
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    // MASUKKAN DATA KE SUPABASE
    const { error } = await _supabase
        .from('posts')
        .insert([{ username: user, content: content }]);

    if (error) {
        console.error("DEBUG ERROR:", error);
        alert("GAGAL HANTAR: " + error.message);
    } else {
        // Jika berjaya, kosongkan kotak content
        contentInput.value = '';
        // Kita tak perlu panggil loadPosts() sebab Realtime dah cover
    }
    
    // Kembalikan butang ke asal
    btn.disabled = false;
    btn.innerText = "Post";
}

// ==========================================
// 5. FUNGSI AMBIL POST (LOAD FEED)
// ==========================================
async function loadPosts() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

    const feed = document.getElementById('feed');
    if (!feed) return;

    if (error) {
        console.error("Ralat database:", error);
        feed.innerHTML = `<div class="alert alert-danger">Ralat: ${error.message}</div>`;
        return;
    }

    if (data) {
        if (data.length === 0) {
            feed.innerHTML = '<div class="text-center text-muted py-5">Belum ada post. Jom jadi yang pertama!</div>';
            return;
        }

        feed.innerHTML = data.map(post => `
            <div class="card mb-3 border-0 shadow-sm p-3 bg-white" style="border-radius: 18px;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-primary small">@${post.username}</span>
                    <span class="text-muted" style="font-size: 0.7rem;">
                        ${new Date(post.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div class="text-dark" style="white-space: pre-wrap; font-size: 1rem; line-height: 1.4;">${post.content}</div>
            </div>
        `).join('');
    }
}

// ==========================================
// 6. FUNGSI LOGOUT (RESET USER)
// ==========================================
function logout() {
    localStorage.removeItem('oml_user');
    location.reload();
}
