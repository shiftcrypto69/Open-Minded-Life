// 1. TETAPAN SUPABASE (URL Khas: Tanpa huruf 'e' pada kysius)
const SUPABASE_URL = 'https://trhbfitkysiusmtwmsh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_-GyGSI-iWUgLCtAGXtidvg_FpDUrNn0'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Ambil nama lama kalau ada
    const savedUser = localStorage.getItem('oml_user');
    if (savedUser) document.getElementById('username').value = savedUser;

    loadPosts();

    // AKTIFKAN REALTIME
    _supabase
        .channel('any')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
            loadPosts();
        })
        .subscribe();
});

// FUNGSI HANTAR POST
async function handlePostSubmit() {
    const user = document.getElementById('username').value.trim() || "Anon";
    const content = document.getElementById('content').value.trim();
    const btn = document.getElementById('postBtn');

    if (!content) return;

    localStorage.setItem('oml_user', user);
    btn.disabled = true;

    // SIMPAN KE DATABASE
    const { error } = await _supabase
        .from('posts')
        .insert([{ username: user, content: content }]);

    if (error) {
        // JIKA GAGAL, DIA AKAN BERITAHU SEBAB APA
        alert("RALAT DATABASE: " + error.message);
        console.error(error);
    } else {
        document.getElementById('content').value = '';
    }
    btn.disabled = false;
}

// FUNGSI MUAT POST
async function loadPosts() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    const feed = document.getElementById('feed');
    if (error) {
        feed.innerHTML = `<div class="text-danger">Gagal muat data: ${error.message}</div>`;
        return;
    }

    if (data) {
        feed.innerHTML = data.map(post => `
            <div class="card mb-3 p-3 shadow-sm" style="border-radius: 15px;">
                <div class="d-flex justify-content-between">
                    <span class="fw-bold text-primary">@${post.username}</span>
                    <small class="text-muted">${new Date(post.created_at).toLocaleTimeString()}</small>
                </div>
                <div class="mt-2">${post.content}</div>
            </div>
        `).join('');
    }
}
