// Data layanan (placeholder, sesuai tabel services pada proposal)
const SERVICES = [
  {id:1, name:'Fast Clean',   cat:'reguler', price:25000,  days:2, desc:'Cuci bagian luar, sol, dan tali. Cocok untuk sepatu harian.'},
  {id:2, name:'Deep Clean',   cat:'reguler', price:40000,  days:3, desc:'Cuci menyeluruh luar-dalam, termasuk insole dan penghilang bau.'},
  {id:3, name:'Whitening',    cat:'khusus',  price:55000,  days:4, desc:'Mengembalikan warna putih midsole dan upper sneakers.'},
  {id:4, name:'Unyellowing',  cat:'khusus',  price:60000,  days:5, desc:'Menghilangkan warna kuning pada sol karet dan midsole.'},
  {id:5, name:'Repaint',      cat:'premium', price:120000, days:7, desc:'Pengecatan ulang bagian sepatu yang pudar atau terkelupas.'},
  {id:6, name:'Premium Care', cat:'premium', price:150000, days:5, desc:'Deep clean, whitening, dan coating pelindung dalam satu paket.'}
];
const CAT_LABEL = {reguler:'Reguler', khusus:'Perawatan Khusus', premium:'Premium'};
const FEE_PICKUP = 10000, FEE_DELIVERY = 10000;
const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

let preselectService = null;   // membawa pilihan dari kalkulator ke form booking

const PAGES = {'pages/layanan.html': () => initLayanan(), 'pages/booking.html': () => initBooking()};
const HASH  = {'#layanan':'pages/layanan.html', '#booking':'pages/booking.html'};

// Memuat halaman ke #content dengan Ajax (jQuery .load)
function loadPage(page){
  $('[data-page]').removeClass('active');
  if(page === 'home'){
    $('#content').addClass('d-none').empty();
    $('#home').removeClass('d-none');
    $('.nav-link[data-page="home"]').addClass('active');
    return;
  }
  $('#home').addClass('d-none');
  $('#content').removeClass('d-none').html('<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>');
  $('.nav-link[data-page="'+page+'"]').addClass('active');
  $('#content').load(page, function(res, status){
    if(status === 'error'){
      $('#content').html('<div class="container py-5"><div class="alert alert-danger">Halaman gagal dimuat. Jalankan lewat web server (mis. XAMPP), bukan membuka file langsung.</div></div>');
      return;
    }
    PAGES[page]();
  });
  window.scrollTo({top:0});
}

function initRouter(){
  $(document).on('click', '[data-page]', function(e){
    e.preventDefault();
    const page = $(this).data('page');
    history.pushState(null, '', page === 'home' ? '#home' : '#' + page.split('/')[1].replace('.html',''));
    loadPage(page);
    const m = document.getElementById('menu');
    if(m.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(m).hide();
  });
  $(window).on('popstate', () => loadPage(HASH[location.hash] || 'home'));
  loadPage(HASH[location.hash] || 'home');
}
