const SUPABASE_URL = 'https://trhbfitkysiusmtwmsh.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_-GyGSI-iWUgLCtAGXtidvg_FpDUrNn0'; 
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('oml_user');
    if (savedUser) document.getElementById('username').value = savedUser;

    loadPosts();

    // REALTIME: Post masuk terus tanpa refresh
    _supabase.channel('public:posts')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
            loadPosts();
        }).subscribe();
});

async function handlePostSubmit() {
    const user = document.getElementById('username').value.trim() || "Anon";
    const content = document.getElementById('content').value.trim();
    const btn = document.getElementById('postBtn');

    if (!content) return;

    localStorage.setItem('oml_user', user);
    btn.disabled = true;
    btn.innerText = "...";

    const { error } = await _supabase.from('posts').insert([{ username: user, content: content }]);

    if (error) {
        alert("Gagal: " + error.message);
    } else {
        document.getElementById('content').value = '';
    }
    btn.disabled = false;
    btn.innerText = "Post";
}

async function loadPosts() {
    const { data, error } = await _supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    const feed = document.getElementById('feed');
    if (error) {
        feed.innerHTML = "Ralat memuatkan data.";
        return;
    }

    if (data.length === 0) {
        feed.innerHTML = '<div class="text-center text-muted py-5">Dinding kosong. Jom tulis sesuatu!</div>';
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
            <div class="text-dark" style="white-space: pre-wrap;">${post.content}</div>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('oml_user');
    location.reload();
}
