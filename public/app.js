// public/app.js
const API_BASE = '/api/gestiones';

// Tipificaciones
const TIPIFICACIONES = [
  'Contacto Efectivo',
  'No Contacto',
  'Promesa de Pago',
  'Pago Realizado',
  'Refinanciación',
  'Información',
  'Escalamiento',
  'Otros'
];

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'
];

let state = { page: 1, limit: 10, totalPages: 1, q: '', tipificacion: '', asesorId: '', desde: '', hasta: '' };
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Elementos
const navDashboard = $('#nav-dashboard');
const navGestiones = $('#nav-gestiones');
const pageDash = $('#page-dashboard');
const pageGest = $('#page-gestiones');
const btnNew = $('#btn-new');
const modal = $('#modal');
const modalDetail = $('#modalDetail');
const formGestion = $('#formGestion');
const tablaBody = $('#tablaBody');
const cardTotal = $('#card-total');
const cardAbiertas = $('#card-abiertas');
const cardCerradas = $('#card-cerradas');
const currentPageEl = $('#currentPage');
const prevPage = $('#prevPage');
const nextPage = $('#nextPage');
const searchInput = $('#searchInput');
const filterTipificacion = $('#filterTipificacion');
const filterAsesor = $('#filterAsesor');
const filterDesde = $('#filterDesde');
const filterHasta = $('#filterHasta');
const btnFilter = $('#btn-filter');
const btnClear = $('#btn-clear');
const latestList = $('#latestList');
const chartTipificacionCtx = document.getElementById('chartTipificacion').getContext('2d');

let editingId = null;
let tipificacionChart = null;

function init() {
  navDashboard.addEventListener('click', () => showPage('dashboard'));
  navGestiones.addEventListener('click', () => showPage('gestiones'));
  btnNew.addEventListener('click', openNewModal);

  btnFilter.addEventListener('click', () => {
    state.tipificacion = filterTipificacion.value;
    state.asesorId = filterAsesor.value;
    state.desde = filterDesde.value;
    state.hasta = filterHasta.value;
    state.page = 1;
    loadGestiones();
    renderDashboard();
  });

  btnClear.addEventListener('click', () => {
    filterTipificacion.value = '';
    filterAsesor.value = '';
    filterDesde.value = '';
    filterHasta.value = '';
    state = { ...state, tipificacion: '', asesorId: '', desde: '', hasta: '', page: 1 };
    loadGestiones();
    renderDashboard();
  });

  prevPage.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; loadGestiones(); } });
  nextPage.addEventListener('click', () => { if (state.page < state.totalPages) { state.page += 1; loadGestiones(); } });

  searchInput.addEventListener('keyup', (e) => {
    state.q = e.target.value;
    state.page = 1;
    clearTimeout(searchInput._t);
    searchInput._t = setTimeout(loadGestiones, 400);
  });

  $('#btnCancel').addEventListener('click', closeModal);
  $('#btnCloseDetail').addEventListener('click', () => toggleModalDetail(false));

  populateTipificaciones();
  TIPIFICACIONES.forEach(t => {
    const opt = document.createElement('option'); opt.value = t; opt.textContent = t;
    filterTipificacion.appendChild(opt);
  });

  loadGestiones();
  renderDashboard();
}

function showPage(page) {
  page === 'dashboard' ? (pageDash.classList.remove('hidden'), pageGest.classList.add('hidden')) : (pageDash.classList.add('hidden'), pageGest.classList.remove('hidden'));
}

function populateTipificaciones() {
  const sel = formGestion.querySelector('select[name=tipificacion]');
  sel.innerHTML = '';
  TIPIFICACIONES.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });
}

async function loadGestiones() {
  const qs = new URLSearchParams({ page: state.page, limit: state.limit });
  if (state.q) qs.set('q', state.q);
  if (state.tipificacion) qs.set('tipificacion', state.tipificacion);
  if (state.asesorId) qs.set('asesorId', state.asesorId);
  if (state.desde) qs.set('desde', state.desde);
  if (state.hasta) qs.set('hasta', state.hasta);

  const res = await fetch(`${API_BASE}?${qs.toString()}`);
  const data = await res.json();

  if (data && data.data) {
    renderTable(data.data);
    state.totalPages = data.meta?.totalPages || 1;
    currentPageEl.textContent = state.page;
  } else {
    tablaBody.innerHTML = '<tr><td colspan="8" class="px-4 py-3">No hay datos</td></tr>';
  }
}

function renderTable(items) {
  tablaBody.innerHTML = '';
  if (!items.length) { tablaBody.innerHTML = '<tr><td colspan="8" class="px-4 py-3">No hay datos</td></tr>'; return; }

  items.forEach((g) => {
    const tr = document.createElement('tr');
    const isCerrada = g.estado?.toLowerCase() === 'cerrada';
    tr.innerHTML = `
      <td class="px-4 py-3">${g.id}</td>
      <td class="px-4 py-3">${g.clienteDocumento || ''}</td>
      <td class="px-4 py-3">${g.clienteNombre || ''}</td>
      <td class="px-4 py-3">${g.asesorId || ''}</td>
      <td class="px-4 py-3">${g.tipificacion || ''}</td>
      <td class="px-4 py-3">${g.estado || ''}</td>
      <td class="px-4 py-3">${formatDate(g.createdAt)}</td>
      <td class="px-4 py-3 text-right space-x-1">
        <button data-id="${g.id}" class="btn-detail px-2 py-1 text-xs rounded bg-slate-100">Detalle</button>
        <button data-id="${g.id}" class="btn-edit px-2 py-1 text-xs rounded bg-amber-100">Editar</button>
        <button data-id="${g.id}" class="btn-close px-2 py-1 text-xs rounded bg-red-100" ${isCerrada ? 'disabled opacity-50 cursor-not-allowed' : ''}>Cerrar</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  $$('.btn-detail').forEach(b => b.addEventListener('click', e => showDetail(e.target.dataset.id)));
  $$('.btn-edit').forEach(b => b.addEventListener('click', e => openEditModal(e.target.dataset.id)));
  $$('.btn-close').forEach(b => b.addEventListener('click', e => closeGestion(e.target.dataset.id)));
}

function formatDate(d) { return d ? new Date(d).toLocaleString() : ''; }

function openNewModal() { editingId = null; $('#modalTitle').textContent = 'Nueva Gestión'; formGestion.reset(); populateTipificaciones(); modal.classList.remove('hidden'); modal.style.display = 'flex'; }
function closeModal() { modal.classList.add('hidden'); modal.style.display = 'none'; }

async function openEditModal(id) {
  editingId = id; $('#modalTitle').textContent = 'Editar Gestión';
  const res = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();
  if (res.ok && data.data) {
    const g = data.data;
    formGestion.elements['clienteDocumento'].value = g.clienteDocumento || '';
    formGestion.elements['clienteNombre'].value = g.clienteNombre || '';
    formGestion.elements['asesorId'].value = g.asesorId || '';
    formGestion.elements['tipificacion'].value = g.tipificacion || TIPIFICACIONES[0];
    formGestion.elements['subtipificacion'].value = g.subtipificacion || '';
    formGestion.elements['fechaCompromiso'].value = g.fechaCompromiso ? g.fechaCompromiso.split('T')[0] : '';
    formGestion.elements['valorCompromiso'].value = g.valorCompromiso || '';
    formGestion.elements['recordingUrl'].value = g.recordingUrl || '';
    formGestion.elements['observaciones'].value = g.observaciones || '';
    modal.classList.remove('hidden'); modal.style.display = 'flex';
  } else alert('No se encontró la gestión');
}

formGestion.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    clienteDocumento: formGestion.elements['clienteDocumento'].value,
    clienteNombre: formGestion.elements['clienteNombre'].value,
    asesorId: formGestion.elements['asesorId'].value,
    tipificacion: formGestion.elements['tipificacion'].value,
    subtipificacion: formGestion.elements['subtipificacion'].value || null,
    fechaCompromiso: formGestion.elements['fechaCompromiso'].value || null,
    valorCompromiso: formGestion.elements['valorCompromiso'].value ? parseFloat(formGestion.elements['valorCompromiso'].value) : null,
    recordingUrl: formGestion.elements['recordingUrl'].value || null,
    observaciones: formGestion.elements['observaciones'].value || null
  };
  try {
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) { closeModal(); loadGestiones(); renderDashboard(); showPage('gestiones'); } else alert('Error: ' + (data.message || JSON.stringify(data)));
  } catch (err) { console.error(err); alert('Error de red'); }
});

async function closeGestion(id) {
  if (!confirm('¿Deseas marcar esta gestión como "Cerrada"?')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Cerrada' }) });
    const data = await res.json();
    if (res.ok) { loadGestiones(); renderDashboard(); } else alert('Error al cerrar: ' + (data.message || JSON.stringify(data)));
  } catch (err) { console.error(err); alert('Error de red'); }
}

async function showDetail(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();
  if (res.ok && data.data) {
    const g = data.data;
    $('#detailBody').innerHTML = `
      <div><strong>ID:</strong> ${g.id}</div>
      <div><strong>Documento:</strong> ${g.clienteDocumento || ''}</div>
      <div><strong>Nombre:</strong> ${g.clienteNombre || ''}</div>
      <div><strong>Asesor:</strong> ${g.asesorId || ''}</div>
      <div><strong>Tipificación:</strong> ${g.tipificacion || ''}</div>
      <div><strong>Subtipificación:</strong> ${g.subtipificacion || ''}</div>
      <div><strong>Valor compromiso:</strong> ${g.valorCompromiso || ''}</div>
      <div><strong>Fecha compromiso:</strong> ${g.fechaCompromiso || ''}</div>
      <div><strong>Observaciones:</strong> ${g.observaciones || ''}</div>
      <div><strong>Estado:</strong> ${g.estado || ''}</div>
      <div><strong>Creado:</strong> ${formatDate(g.createdAt)}</div>
      <div><strong>Recording URL:</strong> <a href="${g.recordingUrl || '#'}" target="_blank">${g.recordingUrl || '—'}</a></div>
    `;
    toggleModalDetail(true);
  } else alert('No se encontró la gestión');
}

function toggleModalDetail(show) { show ? (modalDetail.classList.remove('hidden'), modalDetail.style.display = 'flex') : (modalDetail.classList.add('hidden'), modalDetail.style.display = 'none'); }

async function renderDashboard() {
  try {
    const res = await fetch(`${API_BASE}?page=1&limit=1000`);
    const data = await res.json();
    const list = data.data || [];

    cardTotal.textContent = list.length;
    cardAbiertas.textContent = list.filter(x => x.estado?.toLowerCase() === 'abierta').length;
    cardCerradas.textContent = list.filter(x => x.estado?.toLowerCase() === 'cerrada').length;

    latestList.innerHTML = '';
    list.slice(0, 6).forEach(g => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="font-medium">${g.clienteNombre || '—'}</div><div class="text-xs text-slate-500">${g.tipificacion || ''} · ${formatDate(g.createdAt)}</div>`;
      latestList.appendChild(li);
    });

    const counts = {};
    TIPIFICACIONES.forEach(t => counts[t] = 0);
    list.forEach(g => { if (g.tipificacion && counts[g.tipificacion] !== undefined) counts[g.tipificacion] += 1; });

    const labels = Object.keys(counts).filter(k => counts[k] > 0);
    const values = labels.map(l => counts[l]);
    const chartColors = labels.map((_, idx) => COLORS[idx % COLORS.length]);

    const chartData = { labels, datasets: [{ data: values, backgroundColor: chartColors, borderColor: chartColors, borderWidth: 1 }] };
    const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true }, tooltip: { callbacks: { label: ctx => `${ctx.parsed} gestiones` } } } };

    if (tipificacionChart) { tipificacionChart.data = chartData; tipificacionChart.options = chartOptions; tipificacionChart.update(); }
    else { tipificacionChart = new Chart(chartTipificacionCtx, { type: 'doughnut', data: chartData, options: chartOptions }); }
  } catch (err) { console.error('Error dashboard', err); }
}

init();
