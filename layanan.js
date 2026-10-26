// Nama paket -> nama file foto, contoh: "Fast Clean" jadi "fast-clean.jpg"
function fotoPaket(nama){
  return 'assets/img/' + nama.toLowerCase().replace(/\s+/g, '-') + '.jpg';
}

function initLayanan(){
  let cat = 'semua';

  // Filter paket + cari + urutkan
  function renderList(){
    const q = $('#searchSvc').val().trim().toLowerCase();
    const list = SERVICES.filter(s => (cat === 'semua' || s.cat === cat) && s.name.toLowerCase().includes(q));
    const sort = $('#sortSvc').val();
    if(sort === 'murah') list.sort((a,b) => a.price - b.price);
    if(sort === 'mahal') list.sort((a,b) => b.price - a.price);
    if(sort === 'cepat') list.sort((a,b) => a.days - b.days);

    $('#countSvc').text(list.length + ' paket ditampilkan');
    if(!list.length){
      $('#svcList').html('<div class="col-12"><div class="alert alert-info mb-0">Tidak ada paket yang cocok. Ubah filter atau kata kunci.</div></div>');
      return;
    }
    $('#svcList').html(list.map(s => `
      <div class="col-sm-6 col-lg-4"><div class="svc-card">
        <div class="thumb"><img src="${fotoPaket(s.name)}" alt="Paket ${s.name}" onerror="this.onerror=null;this.src='assets/img/shoe.svg';this.classList.add('fallback')"></div>
        <div class="body">
          <div class="d-flex justify-content-between align-items-start mb-1"><h5 class="mb-0">${s.name}</h5><span class="badge badge-cat">${CAT_LABEL[s.cat]}</span></div>
          <p class="small flex-grow-1">${s.desc}</p>
          <div class="d-flex justify-content-between align-items-center mb-3"><span class="price">${rupiah(s.price)}</span><span class="small text-muted"><i class="bi bi-clock"></i> ${s.days} hari</span></div>
          <button class="btn btn-outline-blue btn-sm pick" data-id="${s.id}">Hitung estimasi</button>
        </div>
      </div></div>`).join(''));
  }

  $('#filterBar').on('click', '[data-cat]', function(){
    $('#filterBar [data-cat]').removeClass('active');
    $(this).addClass('active');
    cat = $(this).data('cat');
    renderList();
  });
  $('#sortSvc').on('change', renderList);
  $('#searchSvc').on('input', renderList);

  // Kalkulator estimasi harga
  $('#calcService').html(SERVICES.map(s => `<option value="${s.id}">${s.name} - ${rupiah(s.price)}</option>`).join(''));

  function calc(){
    const s = SERVICES.find(x => x.id == $('#calcService').val());
    let qty = parseInt($('#calcQty').val());
    if(isNaN(qty) || qty < 1) qty = 1;
    if(qty > 10) qty = 10;
    $('#calcQty').val(qty);

    const express = $('#calcExpress').is(':checked');
    const sub = s.price * qty;
    const disc = qty >= 3 ? sub * 0.10 : 0;
    const exp = express ? (sub - disc) * 0.20 : 0;
    const fee = ($('#calcPickup').is(':checked') ? FEE_PICKUP : 0) + ($('#calcDelivery').is(':checked') ? FEE_DELIVERY : 0);

    const d = new Date();
    d.setDate(d.getDate() + Math.max(1, s.days - (express ? 1 : 0)));

    $('#rQty').text(qty);
    $('#rSub').text(rupiah(sub));
    $('#rDisc').text(disc ? '- ' + rupiah(disc) : '-');
    $('#rExp').text(exp ? '+ ' + rupiah(exp) : '-');
    $('#rFee').text(fee ? '+ ' + rupiah(fee) : '-');
    $('#rTotal').text(rupiah(sub - disc + exp + fee));
    $('#rDate').text(d.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'}));
  }

  $('#calcService, #calcQty, #calcPickup, #calcDelivery, #calcExpress').on('input change', calc);
  $('#qtyPlus').on('click',  () => { $('#calcQty').val(+$('#calcQty').val() + 1); calc(); });
  $('#qtyMinus').on('click', () => { $('#calcQty').val(+$('#calcQty').val() - 1); calc(); });

  $('#svcList').on('click', '.pick', function(){
    $('#calcService').val($(this).data('id'));
    calc();
    $('html, body').animate({scrollTop: $('#kalkulator').offset().top - 80}, 400);
  });

  // Bawa pilihan ke form booking (halaman 2c)
  $('#btnOrder').on('click', function(){
    preselectService = {id: $('#calcService').val(), qty: $('#calcQty').val(),
      pickup: $('#calcPickup').is(':checked'), delivery: $('#calcDelivery').is(':checked')};
    $('.btn[data-page="pages/booking.html"]').first().trigger('click');
  });

  renderList();
  calc();
}