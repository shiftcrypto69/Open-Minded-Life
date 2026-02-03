// Gantikan dengan maklumat dari Settings > API Supabase anda
const SUPABASE_URL = 'https://xyz.supabase.co'; 
const SUPABASE_KEY = 'eyJh......'; // Kod yang sangat panjang (anon public)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Simpan sesi user dalam LocalStorage (supaya tak perlu login setiap kali refresh)
let currentUser = localStorage.getItem('oml_user');

// Semak status login bila page buka
document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    document.getElementById('auth-overlay').style.setProperty('display', 'none', 'important');
    loadPosts();
    // Bonus: Auto-refresh setiap 10 saat
    setInterval(loadPosts, 10000);
  } else {
    document.getElementById('auth-overlay').style.display = 'flex';
  }
});

// Fungsi Login (Tampal Alamat)
function login() {
  const addr = document.getElementById('wallet-input').value.trim();
  if (addr.length < 8) {
    alert("Sila masukkan alamat dompet yang sah.");
    return;
  }
  
  // Format nama: 0x1234...abcd
  const shortName = addr.substring(0, 6) + "..." + addr.slice(-4);
  localStorage.setItem('oml_user', shortName);
  location.reload();
}

function logout() {
  localStorage.removeItem('oml_user');
  location.reload();
}

// Hantar Post
async function handlePostSubmit() {
  const content = document.getElementById('post-content').value.trim();
  const btn = document.getElementById('btn-post');

  if (!content) return;

  btn.disabled = true;
  btn.innerText = "...";

  const { error } = await _supabase
    .from('posts')
    .insert([{ username: currentUser, content: content }]);

  if (error) {
    console.error(error);
    alert("Gagal hantar post: " + error.message);
  } else {
    document.getElementById('post-content').value = '';
    loadPosts();
  }
  btn.disabled = false;
  btn.innerText = "Post";
}

// Ambil Post (Real-time Feel)
async function loadPosts() {
  const { data, error } = await _supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (data) {
    const feed = document.getElementById('feed');
    feed.innerHTML = data.map(post => `
      <div class="card mb-3 border-0 shadow-sm p-3 rounded-4 animate-fade-in">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-bold text-primary small">@${post.username}</span>
          <span class="text-muted" style="font-size: 0.6rem;">${new Date(post.created_at).toLocaleTimeString()}</span>
        </div>
        <div class="mt-2 text-dark" style="white-space: pre-wrap;">${post.content}</div>
      </div>
    `).join('');
  }
}
