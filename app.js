// 1. Tetapan API Supabase (Data anda sudah dimasukkan di sini)
const SUPABASE_URL = 'https://trhbfitkysiusemtwmsh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_-GyGSI-iWUgLCtAGXtidvg_FpDUrNn0'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Ambil data user dari simpanan pelayar
let currentUser = localStorage.getItem('oml_user');

// 3. Jalankan fungsi bila laman web siap dibuka
document.addEventListener('DOMContentLoaded', () => {
  const authOverlay = document.getElementById('auth-overlay');
  const usernameInput = document.getElementById('username');

  // Jika ada nama tersimpan, masukkan terus ke kotak nama
  if (currentUser && usernameInput) {
    usernameInput.value = currentUser;
  }

  // Sembunyikan overlay jika currentUser wujud (logik asal anda)
  if (currentUser && authOverlay) {
    authOverlay.style.setProperty('display', 'none', 'important');
  }

  loadPosts();
  
  // Auto-refresh setiap 10 saat
  setInterval(loadPosts, 10000);
});

// 4. Fungsi Hantar Post
async function handlePostSubmit() {
  const usernameInput = document.getElementById('username'); 
  const contentInput = document.getElementById('content');
  const btn = document.getElementById('postBtn');

  // Ambil nama dari input, jika kosong guna nama lama, jika tiada juga guna Anon
  const user = usernameInput.value.trim() || currentUser || "Anon";
  const content = contentInput.value.trim();

  if (!content) {
    alert("Tulis sesuatu dulu!");
    return;
  }

  // Simpan nama ke localStorage supaya tak payah taip lagi nanti
  localStorage.setItem('oml_user', user);
  currentUser = user;

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
    if (data.length === 0) {
      feed.innerHTML = '<div class="text-center text-muted py-5">Belum ada post. Jadilah yang pertama!</div>';
      return;
    }

    feed.innerHTML = data.map(post => `
      <div class="card mb-3 border-0 shadow-sm p-3 rounded-4 bg-white" style="border-radius: 15px;">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold text-primary small">@${post.username}</span>
          <span class="text-muted" style="font-size: 0.7rem;">${new Date(post.created_at).toLocaleString('ms-MY')}</span>
        </div>
        <div class="mt-2 text-dark" style="white-space: pre-wrap; font-size: 1rem;">${post.content}</div>
      </div>
    `).join('');
  }
}

// 6. Fungsi Logout
function logout() {
    localStorage.removeItem('oml_user');
    location.reload();
}
