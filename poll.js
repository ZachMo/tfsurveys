// Live Poll data layer. Talks to Supabase, or to localStorage in demo mode.
(function () {
  const C = window.POLL_CONFIG || {};
  const LIVE = !!(C.supabaseUrl && C.supabaseAnonKey);
  let sb = null;
  if (LIVE && window.supabase) {
    sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, {
      auth: { persistSession: false }
    });
  }

  // ---- demo store (one browser, many tabs) ----
  const DKEY = 'livepoll-demo';
  const DEMO_CODE = 'demo';
  const demoListeners = new Set();
  function dLoad() {
    try { return JSON.parse(localStorage.getItem(DKEY)) || { current: -1, votes: [] }; }
    catch (e) { return { current: -1, votes: [] }; }
  }
  function dSave(s) {
    try { localStorage.setItem(DKEY, JSON.stringify(s)); } catch (e) {}
    demoListeners.forEach(f => f());
  }
  window.addEventListener('storage', e => { if (e.key === DKEY) demoListeners.forEach(f => f()); });

  function fail(error) { if (error) throw error; }

  const Poll = {
    live: LIVE,
    ready: !LIVE || !!sb,
    config: C,
    questions: C.questions || [],

    voteUrl() {
      return C.voteUrl || new URL('./', location.href).href;
    },

    voterId() {
      let id = null;
      try { id = localStorage.getItem('livepoll-voter'); } catch (e) {}
      if (!id) {
        id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());
        try { localStorage.setItem('livepoll-voter', id); } catch (e) {}
      }
      return id;
    },

    async current() {
      if (!LIVE) return dLoad().current;
      const { data, error } = await sb.from('poll_state').select('current_question').eq('id', 1).single();
      fail(error);
      return data.current_question;
    },

    // Returns { [question]: { [choice]: n } }. Pass null for all questions.
    async counts(q) {
      const out = {};
      const add = (qq, c, n) => { (out[qq] = out[qq] || {})[c] = (out[qq][c] || 0) + n; };
      if (!LIVE) {
        dLoad().votes.forEach(v => { if (q == null || v.question === q) add(v.question, v.choice, 1); });
        return out;
      }
      const { data, error } = await sb.rpc('poll_counts', { p_question: q });
      fail(error);
      data.forEach(r => add(r.question, r.choice, Number(r.n)));
      return out;
    },

    async myVote(q) {
      const voter = Poll.voterId();
      if (!LIVE) {
        const v = dLoad().votes.find(v => v.question === q && v.voter === voter);
        return v ? v.choice : null;
      }
      const { data, error } = await sb.from('poll_votes').select('choice')
        .eq('question', q).eq('voter', voter).maybeSingle();
      fail(error);
      return data ? data.choice : null;
    },

    // Returns 'ok', 'closed' or 'invalid'.
    async vote(q, choice) {
      const voter = Poll.voterId();
      if (!LIVE) {
        const s = dLoad();
        if (s.current !== q) return 'closed';
        s.votes = s.votes.filter(v => !(v.question === q && v.voter === voter));
        s.votes.push({ question: q, choice, voter });
        dSave(s);
        return 'ok';
      }
      const { data, error } = await sb.rpc('cast_vote', { p_question: q, p_choice: choice, p_voter: voter });
      fail(error);
      return data;
    },

    async checkCode(code) {
      if (!LIVE) return code === DEMO_CODE;
      const { data, error } = await sb.rpc('poll_admin_ok', { p_code: code });
      fail(error);
      return data === true;
    },

    // q: 0-based question, or -1 to close voting. Returns 'ok' or 'denied'.
    async setCurrent(code, q) {
      if (!LIVE) {
        if (code !== DEMO_CODE) return 'denied';
        const s = dLoad(); s.current = q; dSave(s); return 'ok';
      }
      const { data, error } = await sb.rpc('set_current_question', { p_code: code, p_question: q });
      fail(error);
      return data;
    },

    // q: 0-based question, or null for all. Returns 'ok' or 'denied'.
    async clear(code, q) {
      if (!LIVE) {
        if (code !== DEMO_CODE) return 'denied';
        const s = dLoad();
        s.votes = q == null ? [] : s.votes.filter(v => v.question !== q);
        dSave(s); return 'ok';
      }
      const { data, error } = await sb.rpc('clear_votes', { p_code: code, p_question: q });
      fail(error);
      return data;
    },

    // Calls fn (debounced) on any change. Polls as a backup in case live updates drop.
    subscribe(fn, pollMs) {
      let t = null;
      const kick = () => { clearTimeout(t); t = setTimeout(fn, 150); };
      if (!LIVE) demoListeners.add(kick);
      else {
        sb.channel('livepoll')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, kick)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_state' }, kick)
          .subscribe();
      }
      setInterval(fn, pollMs || (LIVE ? 5000 : 1500));
    },

    esc(s) {
      return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    },

    // Draws a QR code as an SVG string (needs qrcode-generator).
    qrSvg(text) {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();
      const n = qr.getModuleCount();
      let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" role="img" aria-label="QR code to the vote page">` +
        `<rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#183A78"/></svg>`;
    }
  };

  window.Poll = Poll;
})();
