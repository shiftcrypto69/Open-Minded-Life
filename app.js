// 1. Tetapan API Supabase
const SUPABASE_URL = 'https://xyz.supabase.co'; // Gantikan dengan URL anda
const SUPABASE_KEY = 'eyJh......'; // Gantikan dengan Anon Key anda
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Ambil data user dari simpanan pelayar
let currentUser = localStorage.getItem('oml_user');

// 3. Jalankan fungsi bila laman web siap dibuka
document.addEventListener('DOMContentLoaded', () => {
  const authOverlay = document.getElementById('auth-overlay');
  
  if (currentUser) {
    // Jika sudah login, sorok overlay (guna semakan jika elemen wujud)
    if(authOverlay) authOverlay.style.setProperty('display', 'none', 'important');
    loadPosts();
    // Auto-refresh setiap 10 saat
    setInterval(loadPosts, 10000);
  } else {
    // Jika belum login, pastikan overlay muncul (jika anda buat sistem login)
    if(authOverlay) authOverlay.style.display = 'flex';
  }
});

// 4. Fungsi Hantar Post (Telah diselaraskan dengan ID index.html)
async function handlePostSubmit() {
  // Ambil input dari ID yang betul: 'username' dan 'content'
  const usernameInput = document.getElementById('username'); 
  const contentInput = document.getElementById('content');
  const btn = document.getElementById('postBtn');

  const user = usernameInput.value.trim() || currentUser || "Anon";
  const content = contentInput.value.trim();

  if (!content) {
    alert("Tulis sesuatu dulu!");
    return;
  }

  // Tukar rupa butang masa tengah loading
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

  const { error } = await _supabase
    .from('posts')
    .insert([{ username: user, content: content }]);

  if (error) {
    console.error(error);
    alert("Gagal hantar post: " + error.message);
  } else {
    // Kosongkan kotak teks lepas berjaya
    contentInput.value = '';
    loadPosts();
  }
  
  btn.disabled = false;
  btn.innerText = "Post";
}

// 5. Ambil Post dari Supabase
async function loadPosts() {
  const { data, error } = await _supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  const feed = document.getElementById('feed');
  if (!feed) return;

  if (error) {
    console.error("Ralat ambil data:", error);
    return;
  }

  if (data) {
    feed.innerHTML = data.map(post => `
      <div class="card mb-3 border-0 shadow-sm p-3 rounded-4" style="border-radius: 15px;">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold text-primary small">@${post.username}</span>
          <span class="text-muted" style="font-size: 0.7rem;">${new Date(post.created_at).toLocaleString('ms-MY')}</span>
        </div>
        <div class="mt-2 text-dark" style="white-space: pre-wrap; font-size: 0.95rem;">${post.content}</div>
      </div>
    `).join('');
  }
}
