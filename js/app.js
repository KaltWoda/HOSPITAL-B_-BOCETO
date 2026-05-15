// ===== DATA =====
const AREAS = ['Medicina Interna','UCI Adultos','Imagenología','Recursos Humanos','Dirección Ejecutiva','Emergencias'];
const PERSONAL_MAP = {
  'Dr. Ramos Castillo': {area:'Medicina Interna', cargo:'Jefe de área'},
  'Enf. Altamirano Paz': {area:'UCI Adultos', cargo:'Enfermero'},
  'Tec. Meza Vargas': {area:'Imagenología', cargo:'Técnico'},
  'Dra. Llanos Vásquez': {area:'UCI Adultos', cargo:'Jefe de área'},
  'Dr. García Salcedo': {area:'Dirección Ejecutiva', cargo:'Director Ejecutivo'},
  'Lic. Morales Panta': {area:'Recursos Humanos', cargo:'Jefe de RRHH'},
  'Dr. Huanca Mori': {area:'Emergencias', cargo:'Jefe de área'},
};
const CARGO_MAP = {
  'director ejecutivo': 'Director Ejecutivo',
  'garcía salcedo': 'Director Ejecutivo',
  'morales panta': 'Jefe de RRHH',
  'jefe de rrhh': 'Jefe de RRHH',
  'recursos humanos': 'Jefe de RRHH',
  'rrhh': 'Jefe de RRHH',
};
const JEFES_AREA = {
  'Medicina Interna': 'Dr. Ramos Castillo',
  'UCI Adultos': 'Dra. Llanos Vásquez',
  'Emergencias': 'Dr. Huanca Mori',
  'Imagenología': 'Sin jefe asignado',
  'Recursos Humanos': 'Lic. Morales Panta',
  'Dirección Ejecutiva': 'Dr. García Salcedo',
};

// ===== NAVIGATION =====
let selected = {areas:null, personal:null, turnos:null, roles:null, firmas:null};

function nav(sec, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + sec).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('topbar-title').textContent = el.textContent.trim();
}

// ===== ROW SELECTION =====
function selRow(tr, ctx) {
  const tbl = tr.closest('table');
  tbl.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
  tr.classList.add('selected');
  selected[ctx] = tr;
  const editBtn = document.getElementById('btn-editar-' + ctx);
  const delBtn = document.getElementById('btn-eliminar-' + ctx);
  if(editBtn) editBtn.disabled = false;
  if(delBtn) delBtn.disabled = false;
}

// ===== FILTER =====
function filterTable(tblId, val, col) {
  const rows = document.querySelectorAll('#' + tblId + ' tbody tr');
  const v = val.toLowerCase();
  rows.forEach(r => {
    const cells = r.querySelectorAll('td');
    const text = cells[col] ? cells[col].textContent.toLowerCase() : '';
    r.style.display = text.includes(v) ? '' : 'none';
  });
}

// ===== MODAL =====
function openModal(type) {
  const box = document.getElementById('modal-box');
  box.className = 'modal';
  const tpl = modalTemplates[type];
  if(!tpl) return;
  const d = tpl();
  document.getElementById('modal-title').textContent = d.title;
  document.getElementById('modal-body').innerHTML = d.body;
  document.getElementById('modal-footer').innerHTML = d.footer;
  if(d.large) box.classList.add('modal-lg');
  document.getElementById('overlay').classList.add('open');
  if(d.init) setTimeout(d.init, 50);
}
function closeModal() { document.getElementById('overlay').classList.remove('open'); }
function closeOnBg(e) { if(e.target === document.getElementById('overlay')) closeModal(); }

// ===== TOAST =====
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2500);
}

// ===== CONFIRM ELIMINAR =====
function confirmarEliminar(tipo) {
  document.getElementById('modal-title').textContent = 'Confirmar eliminación';
  document.getElementById('modal-body').innerHTML = `
    <div style="text-align:center;padding:10px 0">
      <div class="confirm-icon"><i class="ti ti-alert-triangle"></i></div>
      <p style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px">¿Está seguro que desea eliminar?</p>
      <p style="font-size:13px;color:var(--text2)">Esta acción no se puede deshacer. El ${tipo} será eliminado permanentemente del sistema.</p>
    </div>`;
  document.getElementById('modal-footer').innerHTML = `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-danger" onclick="closeModal();toast('${tipo.charAt(0).toUpperCase()+tipo.slice(1)} eliminado correctamente')"><i class="ti ti-trash"></i> Eliminar</button>`;
  document.getElementById('overlay').classList.add('open');
}

// ===== EDITAR HELPERS =====
function editarArea() {
  if(!selected.areas) return;
  const cells = selected.areas.querySelectorAll('td');
  const nombre = cells[0].textContent.trim();
  const jefe = cells[1].textContent.trim();
  const personal = cells[2].textContent.trim();
  openModal('area-editar');
  setTimeout(() => {
    document.getElementById('e-area-nombre').value = nombre;
    document.getElementById('e-area-jefe').value = jefe;
    document.getElementById('e-area-personal').value = personal;
  }, 60);
}
function editarPersonal() {
  if(!selected.personal) return;
  const cells = selected.personal.querySelectorAll('td');
  openModal('personal-editar');
  setTimeout(() => {
    document.getElementById('e-per-nombre').value = cells[0].textContent.trim();
    document.getElementById('e-per-dni').value = cells[1].textContent.trim();
    document.getElementById('e-per-area').value = cells[2].textContent.trim();
    document.getElementById('e-per-turno').value = cells[3].textContent.trim();
    document.getElementById('e-per-cargo').value = cells[4].textContent.trim();
  }, 60);
}
function editarTurno() {
  if(!selected.turnos) return;
  const cells = selected.turnos.querySelectorAll('td');
  openModal('turno-editar');
  setTimeout(() => {
    document.getElementById('e-turno-tipo').value = cells[0].textContent.trim();
    document.getElementById('e-turno-area').value = cells[1].textContent.trim();
  }, 60);
}
function editarRol() {
  if(!selected.roles) return;
  const cells = selected.roles.querySelectorAll('td');
  openModal('rol-editar');
  setTimeout(() => {
    document.getElementById('e-rol-nombre').value = cells[0].textContent.trim();
    document.getElementById('e-rol-doctor').value = cells[1].textContent.trim();
    document.getElementById('e-rol-area').value = cells[2].textContent.trim();
  }, 60);
}
function editarFirma() {
  if(!selected.firmas) return;
  const cells = selected.firmas.querySelectorAll('td');
  openModal('firma-editar');
  setTimeout(() => {
    document.getElementById('e-firma-firmante').value = cells[0].textContent.trim();
    document.getElementById('e-firma-tipo').value = cells[1].textContent.trim().toLowerCase().includes('obligatoria') ? 'Obligatoria' : 'Opcional';
    document.getElementById('e-firma-cargo').value = cells[2].textContent.trim();
    document.getElementById('e-firma-area').value = cells[3].textContent.trim();
  }, 60);
}

// ===== HISTORICO =====
function verHistorico(e, nombre) {
  e.stopPropagation();
  document.getElementById('modal-title').textContent = `Histórico — ${nombre}`;
  document.getElementById('modal-body').innerHTML = `
    <p style="font-size:12px;color:var(--text2);margin-bottom:14px">Roles ocupados o solicitados durante el mes de trabajo.</p>
    <div>
      <div class="hist-item"><div class="hist-dot"></div><div><div style="font-size:13px;font-weight:500">Médico de guardia · Medicina Interna</div><div style="font-size:12px;color:var(--text2)">Enero 2025 — <span class="badge badge-green" style="font-size:10px">Completado</span></div></div></div>
      <div class="hist-item"><div class="hist-dot"></div><div><div style="font-size:13px;font-weight:500">Médico Especialista UCI</div><div style="font-size:12px;color:var(--text2)">Febrero 2025 — <span class="badge badge-green" style="font-size:10px">Completado</span></div></div></div>
      <div class="hist-item"><div class="hist-dot" style="background:var(--warn)"></div><div><div style="font-size:13px;font-weight:500">Consultor externo · Imagenología</div><div style="font-size:12px;color:var(--text2)">Marzo 2025 — <span class="badge badge-amber" style="font-size:10px">En proceso</span></div></div></div>
      <div class="hist-item"><div class="hist-dot" style="background:var(--info)"></div><div><div style="font-size:13px;font-weight:500">Jefe interino · Emergencias</div><div style="font-size:12px;color:var(--text2)">Abril 2025 — <span class="badge badge-blue" style="font-size:10px">Programado</span></div></div></div>
    </div>`;
  document.getElementById('modal-footer').innerHTML = `<button class="btn" onclick="closeModal()">Cerrar</button>`;
  document.getElementById('overlay').classList.add('open');
}
function verHistoricoRol(e, nombre) {
  e.stopPropagation();
  verHistorico(e, nombre);
}

// ===== CONCEDER FIRMA =====
let cfEstado = 'inactivo';
function openConceder(rol, doctor, area, desc) {
  document.getElementById('modal-title').textContent = 'Conceder firma';
  document.getElementById('modal-box').classList.add('modal-lg');
  document.getElementById('modal-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <p style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Información del rol</p>
        <div style="background:var(--slate-light);border-radius:var(--radius);padding:14px">
          <div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px">${rol}</div>
          <div style="font-size:12px;color:var(--text2);margin-bottom:4px"><strong>Doctor:</strong> ${doctor}</div>
          <div style="font-size:12px;color:var(--text2);margin-bottom:4px"><strong>Área:</strong> ${area}</div>
          <div style="font-size:12px;color:var(--text2)"><strong>Descripción:</strong> ${desc}</div>
        </div>
      </div>
      <div>
        <p style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Activar firma</p>
        <div style="background:var(--slate-light);border-radius:var(--radius);padding:14px">
          <div class="form-row"><label class="lbl">DNI Electrónico <span class="req">*</span></label><input type="text" id="cf-dni" placeholder="Ingrese su DNI electrónico" oninput="checkDNI()"></div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
            <div class="toggle-wrap">
              <button class="toggle-btn inactivo-sel" id="cf-btn-inactivo" onclick="setCFEstado('inactivo')">Inactivo</button>
              <button class="toggle-btn" id="cf-btn-activo" onclick="setCFEstado('activo')" disabled>Activo</button>
            </div>
            <div style="flex:1;text-align:right">
              <span style="font-size:11px;color:var(--text2)">Estado: </span>
              <span id="cf-estado-badge" class="badge badge-red">Inactivo</span>
            </div>
          </div>
          <div style="border-top:1px solid var(--slate-mid);padding-top:12px">
            <p style="font-size:12px;font-weight:500;color:var(--text2);margin-bottom:8px">Firma</p>
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
              <input type="checkbox" id="cf-check" class="firma-check" disabled>
              <span>Confirmo que he revisado el rol y autorizo con mi firma</span>
            </label>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('modal-footer').innerHTML = `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="confirmarFirma()"><i class="ti ti-check"></i> Confirmar firma</button>`;
  document.getElementById('overlay').classList.add('open');
  cfEstado = 'inactivo';
}
function checkDNI() {
  const dni = document.getElementById('cf-dni').value;
  const btn = document.getElementById('cf-btn-activo');
  if(btn) btn.disabled = dni.length < 8;
}
function setCFEstado(est) {
  cfEstado = est;
  const btnA = document.getElementById('cf-btn-activo');
  const btnI = document.getElementById('cf-btn-inactivo');
  const badge = document.getElementById('cf-estado-badge');
  const chk = document.getElementById('cf-check');
  if(!btnA) return;
  if(est === 'activo') {
    btnA.classList.add('activo');
    btnI.classList.remove('inactivo-sel');
    badge.className = 'badge badge-green';
    badge.textContent = 'Activo';
    chk.disabled = false;
  } else {
    btnI.classList.add('inactivo-sel');
    btnA.classList.remove('activo');
    badge.className = 'badge badge-red';
    badge.textContent = 'Inactivo';
    chk.disabled = true;
    chk.checked = false;
  }
}
function confirmarFirma() {
  if(cfEstado !== 'activo') { toast('Debe activar su estado con DNI electrónico primero'); return; }
  const chk = document.getElementById('cf-check');
  if(!chk || !chk.checked) { toast('Debe marcar la casilla de firma'); return; }
  closeModal();
  setTimeout(() => {
    document.getElementById('modal-box').className = 'modal';
    document.getElementById('modal-title').textContent = '¿Confirmar firma?';
    document.getElementById('modal-body').innerHTML = `
      <div style="text-align:center;padding:10px 0">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--teal-light);display:flex;align-items:center;justify-content:center;font-size:28px;color:var(--teal2);margin:0 auto 14px"><i class="ti ti-signature"></i></div>
        <p style="font-size:15px;font-weight:600;margin-bottom:8px">¿Está seguro que desea confirmar la firma?</p>
        <p style="font-size:13px;color:var(--text2)">Esta acción registrará su firma oficial en el sistema y no podrá revertirse.</p>
      </div>`;
    document.getElementById('modal-footer').innerHTML = `
      <button class="btn" onclick="closeModal()">No</button>
      <button class="btn btn-teal" onclick="closeModal();toast('Firma confirmada exitosamente')"><i class="ti ti-check"></i> Sí, confirmar</button>`;
    document.getElementById('overlay').classList.add('open');
  }, 100);
}

// ===== DOCTOR AUTOCOMPLETAR =====
function autoDoctorChange(inputId, areaId, cargoId, firmasId) {
  const nombre = document.getElementById(inputId).value;
  const info = PERSONAL_MAP[nombre];
  if(info) {
    if(areaId) document.getElementById(areaId).value = info.area;
    if(cargoId) document.getElementById(cargoId).value = info.cargo;
    if(firmasId) actualizarFirmas(info.area, firmasId);
  }
}
function actualizarFirmas(area, containerId) {
  const jefe = JEFES_AREA[area] || 'Sin jefe asignado';
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = `
    <div class="firma-row"><input type="checkbox" class="firma-check" checked disabled> <span style="font-size:13px">${jefe} — Jefe de área (${area})</span> <span class="badge badge-red" style="margin-left:auto">Obligatoria</span></div>
    <div class="firma-row"><input type="checkbox" class="firma-check" checked disabled> <span style="font-size:13px">Lic. Morales Panta — Jefe de RRHH</span> <span class="badge badge-red" style="margin-left:auto">Obligatoria</span></div>
    <div class="firma-row"><input type="checkbox" class="firma-check" checked disabled> <span style="font-size:13px">Dr. García Salcedo — Director Ejecutivo</span> <span class="badge badge-red" style="margin-left:auto">Obligatoria</span></div>`;
}
function autoFirmanteChange(inputId, cargoId, areaId) {
  const nombre = document.getElementById(inputId).value.toLowerCase();
  const info = PERSONAL_MAP[Object.keys(PERSONAL_MAP).find(k => k.toLowerCase().includes(nombre)) || ''];
  if(info) {
    if(cargoId) document.getElementById(cargoId).value = info.cargo;
    if(areaId) document.getElementById(areaId).value = info.area;
  } else {
    // Check cargo map
    for(const [key, val] of Object.entries(CARGO_MAP)) {
      if(nombre.includes(key)) {
        if(cargoId) document.getElementById(cargoId).value = val;
        break;
      }
    }
  }
}

// ===== MODAL TEMPLATES =====
const modalTemplates = {
  // AREA
  'area-crear': () => ({
    title: 'Nueva área',
    body: `
      <div class="form-row"><label class="lbl">Nombre del área <span class="req">*</span></label><input type="text" placeholder="Ej: Cardiología"></div>
      <div class="form-row"><label class="lbl">Código <span class="req">*</span></label><input type="text" placeholder="Ej: CARD-01"></div>
      <div class="form-row"><label class="lbl">Jefe de área</label><select><option value="">Sin asignar</option><option>Dr. Ramos Castillo</option><option>Dra. Llanos Vásquez</option><option>Dr. Huanca Mori</option><option>Lic. Morales Panta</option><option>Dr. García Salcedo</option></select></div>
      <div class="form-row"><label class="lbl">Personal estimado</label><input type="text" placeholder="Ej: 10"></div>
      <div class="form-row"><label class="lbl">Descripción</label><textarea placeholder="Descripción del área..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="closeModal();toast('Área creada correctamente')"><i class="ti ti-plus"></i> Crear área</button>`
  }),
  'area-editar': () => ({
    title: 'Editar área',
    body: `
      <div class="form-row"><label class="lbl">Nombre del área <span class="req">*</span></label><input type="text" id="e-area-nombre"></div>
      <div class="form-row"><label class="lbl">Jefe de área</label><input type="text" id="e-area-jefe"></div>
      <div class="form-row"><label class="lbl">Personal</label><input type="text" id="e-area-personal"></div>
      <div class="form-row"><label class="lbl">Descripción</label><textarea placeholder="Descripción del área..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-warn" onclick="closeModal();toast('Área editada correctamente')"><i class="ti ti-edit"></i> Editar área</button>`
  }),
  // PERSONAL
  'personal-crear': () => ({
    title: 'Nuevo personal',
    body: `
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Nombres <span class="req">*</span></label><input type="text" placeholder="Nombres completos"></div>
        <div class="form-row"><label class="lbl">Apellidos <span class="req">*</span></label><input type="text" placeholder="Apellidos completos"></div>
        <div class="form-row"><label class="lbl">DNI <span class="req">*</span></label><input type="text" placeholder="00000000"></div>
        <div class="form-row"><label class="lbl">Correo</label><input type="email" placeholder="correo@hbl.gob.pe"></div>
      </div>
      <div class="form-row"><label class="lbl">Área <span class="req">*</span></label><select>${AREAS.map(a=>`<option>${a}</option>`).join('')}</select></div>
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Turno <span class="req">*</span></label><select><option>Mañana</option><option>Tarde</option><option>Noche</option><option>Turno 24h</option></select></div>
        <div class="form-row"><label class="lbl">Cargo</label><select><option>Personal</option><option>Jefe de área</option><option>Secretaría</option><option>Director Ejecutivo</option><option>Jefe de RRHH</option></select></div>
      </div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="closeModal();toast('Personal registrado correctamente')"><i class="ti ti-plus"></i> Registrar</button>`
  }),
  'personal-editar': () => ({
    title: 'Editar personal',
    body: `
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Nombre <span class="req">*</span></label><input type="text" id="e-per-nombre"></div>
        <div class="form-row"><label class="lbl">DNI <span class="req">*</span></label><input type="text" id="e-per-dni"></div>
        <div class="form-row"><label class="lbl">Área</label><input type="text" id="e-per-area"></div>
        <div class="form-row"><label class="lbl">Turno</label><input type="text" id="e-per-turno"></div>
      </div>
      <div class="form-row"><label class="lbl">Cargo</label><input type="text" id="e-per-cargo"></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-warn" onclick="closeModal();toast('Personal editado correctamente')"><i class="ti ti-edit"></i> Editar</button>`
  }),
  // TURNO
  'turno-crear': () => ({
    title: 'Nuevo turno',
    body: `
      <div class="form-row"><label class="lbl">Tipo de turno <span class="req">*</span></label>
        <select><option value="">Seleccione...</option><option>Mañana (07:00 – 13:00)</option><option>Noche (19:00 – 07:00)</option><option>Turno de 24 horas (07:00 – 07:00)</option></select>
      </div>
      <div class="form-row"><label class="lbl">Área <span class="req">*</span></label><input type="text" placeholder="Escriba el nombre del área"></div>
      <div class="form-row"><label class="lbl">Observaciones</label><textarea placeholder="Indicaciones especiales del turno..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="closeModal();toast('Turno creado correctamente')"><i class="ti ti-plus"></i> Crear turno</button>`
  }),
  'turno-editar': () => ({
    title: 'Editar turno',
    body: `
      <div class="form-row"><label class="lbl">Tipo de turno <span class="req">*</span></label>
        <select id="e-turno-tipo"><option>Mañana (07:00 – 13:00)</option><option>Noche (19:00 – 07:00)</option><option>Turno de 24 horas</option><option>Tarde (13:00 – 19:00)</option></select>
      </div>
      <div class="form-row"><label class="lbl">Área</label><input type="text" id="e-turno-area"></div>
      <div class="form-row"><label class="lbl">Observaciones</label><textarea placeholder="Indicaciones especiales..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-warn" onclick="closeModal();toast('Turno editado correctamente')"><i class="ti ti-edit"></i> Editar</button>`
  }),
  // ROL
  'rol-crear': () => ({
    title: 'Nuevo rol',
    body: `
      <div class="info-alert" style="margin-bottom:12px"><i class="ti ti-info-circle"></i><div>El área se asigna automáticamente al ingresar el nombre del doctor y presionar Enter. Las firmas obligatorias se seleccionan automáticamente.</div></div>
      <div class="form-row"><label class="lbl">Nombre del rol <span class="req">*</span></label><input type="text" placeholder="Ej: Médico especialista UCI"></div>
      <div class="form-row"><label class="lbl">Doctor asignado <span class="req">*</span></label>
        <select id="r-doctor" onchange="autoDoctorChange('r-doctor','r-area','r-cargo','r-firmas-box')">
          <option value="">Seleccione doctor...</option>
          ${Object.keys(PERSONAL_MAP).map(k=>`<option>${k}</option>`).join('')}
        </select>
      </div>
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Área (auto)</label><input type="text" id="r-area" placeholder="Se completa automáticamente" readonly style="background:var(--slate-light)"></div>
        <div class="form-row"><label class="lbl">Cargo (auto)</label><input type="text" id="r-cargo" placeholder="Se completa automáticamente" readonly style="background:var(--slate-light)"></div>
      </div>
      <div class="form-row"><label class="lbl">Descripción del rol</label><textarea placeholder="Funciones y responsabilidades del rol..."></textarea></div>
      <div class="form-row"><label class="lbl">Firmas obligatorias (auto-seleccionadas)</label>
        <div class="firma-box" id="r-firmas-box">
          <div style="font-size:12px;color:var(--text2);text-align:center;padding:10px">Seleccione un doctor para ver las firmas requeridas</div>
        </div>
      </div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="closeModal();toast('Rol creado correctamente')"><i class="ti ti-plus"></i> Crear rol</button>`
  }),
  'rol-editar': () => ({
    title: 'Editar rol',
    body: `
      <div class="form-row"><label class="lbl">Nombre del rol <span class="req">*</span></label><input type="text" id="e-rol-nombre"></div>
      <div class="form-row"><label class="lbl">Doctor asignado</label><input type="text" id="e-rol-doctor"></div>
      <div class="form-row"><label class="lbl">Área</label><input type="text" id="e-rol-area" readonly style="background:var(--slate-light)"></div>
      <div class="form-row"><label class="lbl">Descripción</label><textarea placeholder="Descripción del rol..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-warn" onclick="closeModal();toast('Rol editado correctamente')"><i class="ti ti-edit"></i> Editar</button>`
  }),
  // FIRMA
  'firma-crear': () => ({
    title: 'Nueva firma',
    body: `
      <div class="info-alert" style="margin-bottom:12px"><i class="ti ti-info-circle"></i><div>Solo jefes de área pueden ser firmantes. El cargo y área se asignan automáticamente.</div></div>
      <div class="form-row"><label class="lbl">Firmante <span class="req">*</span></label>
        <select id="f-firmante" onchange="autoFirmanteChange('f-firmante','f-cargo','f-area')">
          <option value="">Seleccione firmante...</option>
          ${Object.keys(PERSONAL_MAP).map(k=>`<option>${k}</option>`).join('')}
        </select>
      </div>
      <div class="form-row"><label class="lbl">Tipo de firma <span class="req">*</span></label>
        <select id="f-tipo"><option>Obligatoria</option><option>Opcional</option></select>
      </div>
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Cargo (auto)</label><input type="text" id="f-cargo" readonly style="background:var(--slate-light)" placeholder="Se completa automáticamente"></div>
        <div class="form-row"><label class="lbl">Área (auto)</label><input type="text" id="f-area" readonly style="background:var(--slate-light)" placeholder="Se completa automáticamente"></div>
      </div>
      <div class="form-row"><label class="lbl">Observaciones</label><textarea placeholder="Notas sobre esta firma..."></textarea></div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-teal" onclick="closeModal();toast('Firma registrada correctamente')"><i class="ti ti-plus"></i> Registrar firma</button>`
  }),
  'firma-editar': () => ({
    title: 'Editar firma',
    body: `
      <div class="form-row"><label class="lbl">Firmante <span class="req">*</span></label><input type="text" id="e-firma-firmante"></div>
      <div class="form-row"><label class="lbl">Tipo de firma</label>
        <select id="e-firma-tipo"><option>Obligatoria</option><option>Opcional</option></select>
      </div>
      <div class="form-grid">
        <div class="form-row"><label class="lbl">Cargo</label><input type="text" id="e-firma-cargo"></div>
        <div class="form-row"><label class="lbl">Área</label><input type="text" id="e-firma-area"></div>
      </div>`,
    footer: `<button class="btn" onclick="closeModal()">Cancelar</button><button class="btn btn-warn" onclick="closeModal();toast('Firma editada correctamente')"><i class="ti ti-edit"></i> Editar</button>`
  }),
};
