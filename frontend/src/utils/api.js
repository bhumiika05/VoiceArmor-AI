import axios from 'axios';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await axios.get(`${API_BASE}/health`);
  return res.data;
}

export async function fetchDashboard() {
  const res = await axios.get(`${API_BASE}/dashboard`);
  return res.data;
}

export async function analyzeVoice(audioFile, sensitiveAction = 'MONEY_TRANSFER', speakerId = '', language = 'auto') {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('sensitive_action', sensitiveAction);
  if (speakerId) formData.append('speaker_id', speakerId);
  formData.append('language', language);

  const res = await axios.post(`${API_BASE}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function fetchSpeakers() {
  const res = await axios.get(`${API_BASE}/speakers`);
  return res.data;
}

export async function enrollSpeaker(name, role, audioFile) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('role', role);
  formData.append('file', audioFile);

  const res = await axios.post(`${API_BASE}/speakers/enroll`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function deleteSpeaker(speakerId) {
  const res = await axios.delete(`${API_BASE}/speakers/${speakerId}`);
  return res.data;
}

export async function fetchIncidents(level = 'ALL') {
  const url = level && level !== 'ALL' ? `${API_BASE}/incidents?level=${level}` : `${API_BASE}/incidents`;
  const res = await axios.get(url);
  return res.data;
}

export async function clearIncidents() {
  const res = await axios.delete(`${API_BASE}/incidents`);
  return res.data;
}

export async function simulateAttack(scenario = 'Executive Wire Fraud', targetSpeaker = 'CEO Alexander Vance', sensitiveAction = 'MONEY_TRANSFER') {
  const formData = new FormData();
  formData.append('scenario', scenario);
  formData.append('target_speaker', targetSpeaker);
  formData.append('sensitive_action', sensitiveAction);

  const res = await axios.post(`${API_BASE}/demo/attack`, formData);
  return res.data;
}

export async function getChallengePhrase() {
  const res = await axios.get(`${API_BASE}/verify/phrase`);
  return res.data;
}

export async function processVerification(incidentId, challengePhrase, spokenPhrase) {
  const formData = new FormData();
  formData.append('incident_id', incidentId);
  formData.append('challenge_phrase', challengePhrase);
  formData.append('spoken_phrase', spokenPhrase);

  const res = await axios.post(`${API_BASE}/verify/challenge`, formData);
  return res.data;
}

export function downloadIncidentReport(incidentId, format = 'pdf') {
  window.open(`${API_BASE}/incidents/${incidentId}/report?format=${format}`, '_blank');
}
