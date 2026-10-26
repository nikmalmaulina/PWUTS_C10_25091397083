function initBooking(){
  const $f = $('#formBooking');
  $('#service_id').html('<option value="">Pilih paket...</option>' + SERVICES.map(s => `<option value="${s.id}">${s.name} - ${rupiah(s.price)} (${s.days} hari)</option>`).join(''));
  $('#pickup_date').attr('min', new Date().toISOString().split('T')[0]);

  // Isi otomatis dari kalkulator halaman layanan
  if(preselectService){
    $('#service_id').val(preselectService.id);
    $('#shoe_count').val(preselectService.qty);
    if(preselectService.pickup) $('#pickup_method').val('Dijemput');
    if(preselectService.delivery) $('#delivery_method').val('Diantar');
    preselectService = null;
  }

  function total(){
    const s = SERVICES.find(x => x.id == $('#service_id').val());
    const q = parseInt($('#shoe_count').val()) || 0;
    $('#bTotal').text(s && q > 0 ? rupiah(s.price * q * (q >= 3 ? 0.9 : 1)) : '-');
  }
  // Tampilkan kolom alamat/tanggal sesuai pilihan
  function toggleBox(){
    const pick = $('#pickup_method').val() === 'Dijemput', del = $('#delivery_method').val() === 'Diantar';
    $('#pickupBox').toggleClass('d-none', !(pick || del));
    $('#dateBox, #timeBox').toggleClass('d-none', !pick);
  }
  $f.on('input change', 'select, input', function(){ total(); toggleBox(); $(this).removeClass('is-invalid'); });
  total(); toggleBox();

  function err(id, msg){ $('#'+id).addClass('is-invalid').next('.invalid-feedback').text(msg); return false; }

  // Validasi sisi client dengan jQuery
  function validate(){
    $f.find('.is-invalid').removeClass('is-invalid');
    let ok = true;
    const v = id => $('#'+id).val().trim();
    if(v('name').length < 3) ok = err('name', 'Nama minimal 3 karakter.');
    else if(!/^[A-Za-z .'-]+$/.test(v('name'))) ok = err('name', 'Nama hanya boleh berisi huruf.');
    if(!/^(08|\+628|628)\d{8,12}$/.test(v('whatsapp'))) ok = err('whatsapp', 'Nomor WhatsApp tidak valid. Contoh: 081234567890.');
    if(!v('service_id')) ok = err('service_id', 'Pilih paket layanan.');
    const q = parseInt(v('shoe_count'));
    if(isNaN(q) || q < 1 || q > 10) ok = err('shoe_count', 'Jumlah sepatu 1 sampai 10.');
    if(v('shoe_type').length < 3) ok = err('shoe_type', 'Isi jenis atau merek sepatu.');
    const file = $('#photo')[0].files[0];
    if(file){
      if(!/^image\/(png|jpeg)$/.test(file.type)) ok = err('photo', 'Format foto harus JPG atau PNG.');
      else if(file.size > 2 * 1024 * 1024) ok = err('photo', 'Ukuran foto maksimal 2 MB.');
    }
    if(!v('pickup_method')) ok = err('pickup_method', 'Pilih cara pengambilan sepatu.');
    if(!v('delivery_method')) ok = err('delivery_method', 'Pilih cara pengembalian sepatu.');
    const pick = v('pickup_method') === 'Dijemput', del = v('delivery_method') === 'Diantar';
    if((pick || del) && v('address').length < 10) ok = err('address', 'Alamat minimal 10 karakter.');
    if(pick){
      if(!v('pickup_date')) ok = err('pickup_date', 'Pilih tanggal jemput.');
      else if(new Date(v('pickup_date')) < new Date(new Date().toDateString())) ok = err('pickup_date', 'Tanggal tidak boleh sebelum hari ini.');
      if(!v('pickup_time')) ok = err('pickup_time', 'Pilih jam jemput.');
    }
    return ok;
  }

  // Kirim ke server (HTTP POST) hanya jika validasi lolos
  $f.on('submit', function(e){
    e.preventDefault();
    if(!validate()){ $f.find('.is-invalid').first().focus(); return; }
    $('#btnSubmit').prop('disabled', true).text('Mengirim...');
    $.ajax({
      url:'proses_booking.php', method:'POST', data:new FormData(this),
      processData:false, contentType:false, dataType:'json'
    }).done(res => {
      if(res.success){
        $f.addClass('d-none');
        $('#bookingAlert').html(`<div class="alert alert-success"><h5 class="alert-heading">Pesanan berhasil dibuat</h5>
          <p class="mb-1">Nomor pesanan: <strong>${res.order_code}</strong></p>
          <p class="mb-1">Total: <strong>${rupiah(res.total_price)}</strong></p>
          <p class="mb-0">Estimasi selesai: <strong>${res.estimated_completion}</strong>. Simpan nomor pesananmu.</p></div>`);
      } else {
        $('#bookingAlert').html(`<div class="alert alert-danger">${res.message}</div>`);
        $('#btnSubmit').prop('disabled', false).text('Kirim pesanan');
      }
    }).fail(() => {
      $('#bookingAlert').html('<div class="alert alert-danger">Server tidak dapat dihubungi. Pastikan Apache dan MySQL aktif, lalu coba lagi.</div>');
      $('#btnSubmit').prop('disabled', false).text('Kirim pesanan');
    });
    window.scrollTo({top:0, behavior:'smooth'});
  });
}
