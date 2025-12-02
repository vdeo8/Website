// Gamification: matching games and quizzes for Challenges page
(function(){
  function setupMatching(rootId){
    const root = document.getElementById(rootId);
    if (!root) return;
    const terms = Array.from(root.querySelectorAll('.term'));
    const defs = Array.from(root.querySelectorAll('.def'));
    const msg = document.getElementById(rootId + '-msg');
    let selectedTerm = null;
    let matches = 0;
    const total = terms.length;

    function reset(){
      selectedTerm = null;
      matches = 0;
      terms.forEach(t => { t.classList.remove('selected','matched'); t.disabled = false; });
      defs.forEach(d => { d.classList.remove('matched'); d.disabled = false; });
      if (msg) msg.textContent = '';
    }

    terms.forEach(t => {
      t.addEventListener('click', ()=>{ 
        if (t.classList.contains('matched')) return;
        terms.forEach(x=>x.classList.remove('selected'));
        selectedTerm = t;
        t.classList.add('selected');
      });
    });

    defs.forEach(d => {
      d.addEventListener('click', ()=>{
        if (!selectedTerm || d.classList.contains('matched')) return;
        const keyT = selectedTerm.dataset.key;
        const keyD = d.dataset.key;
        if (keyT === keyD){
          // correct
          selectedTerm.classList.add('matched');
          d.classList.add('matched');
          selectedTerm.disabled = true;
          d.disabled = true;
          matches += 1;
          if (msg) msg.textContent = `Correct! ${matches} / ${total} matched.`;
          if (matches === total){
            if (msg) msg.textContent = `Well done — all matched!`;
          }
        } else {
          // incorrect
          if (msg) msg.textContent = 'Not a match — try again.';
        }
        // clear selection
        terms.forEach(x=>x.classList.remove('selected'));
        selectedTerm = null;
      });
    });

    // reset hook
    const resetBtn = root.closest('.challenge-panel')?.querySelector('[data-action="reset-matching"][data-target="'+rootId+'"]');
    if (resetBtn) resetBtn.addEventListener('click', reset);
  }

  function setupQuizzes(){
    const quizzes = Array.from(document.querySelectorAll('.quiz'));
    quizzes.forEach(q => {
      const submitBtn = q.querySelector('[data-action="submit-quiz"]');
      const resetBtn = q.querySelector('[data-action="reset-quiz"]');
      const resultEl = q.querySelector('.quiz-result');
      if (submitBtn){
        submitBtn.addEventListener('click', ()=>{
          const questions = Array.from(q.querySelectorAll('.question'));
          let correct = 0;
          let total = questions.length;
          questions.forEach((qs) => {
            const correctAns = qs.dataset.correct;
            const selected = qs.querySelector('input[type="radio"]:checked');
            if (selected && selected.value === correctAns){
              correct += 1;
              qs.classList.remove('incorrect');
              qs.classList.add('correct');
            } else {
              qs.classList.remove('correct');
              qs.classList.add('incorrect');
            }
          });
          if (resultEl) resultEl.textContent = `You scored ${correct} / ${total}.`;
        });
      }
      if (resetBtn){
        resetBtn.addEventListener('click', ()=>{
          const questions = Array.from(q.querySelectorAll('.question'));
          questions.forEach(qs => {
            const checked = qs.querySelector('input[type="radio"]:checked');
            if (checked) checked.checked = false;
            qs.classList.remove('correct','incorrect');
          });
          if (resultEl) resultEl.textContent = '';
        });
      }
    });
  }

  // Panel show/hide handlers for Challenges page
  function setupPanels(){
    document.querySelectorAll('[data-show]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.show;
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.remove('hidden');
        panel.setAttribute('aria-hidden','false');
        // initialize matching/quizzes inside the panel (in case they weren't present earlier)
        // setupMatching called globally on DOMContentLoaded, but call again safely
        const possibleMatching = panel.querySelector('.matching-game');
        if (possibleMatching) setupMatching(possibleMatching.id);
        const possibleQuiz = panel.querySelector('.quiz');
        if (possibleQuiz) setupQuizzes();
        // scroll to panel
        panel.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });

    document.querySelectorAll('[data-close-panel]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.closePanel;
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.classList.add('hidden');
        panel.setAttribute('aria-hidden','true');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // If matching/quizzes exist on load (they won't on topic pages), initialize them safely:
    setupMatching('banking-matching');
    setupMatching('taxes-matching');
    setupMatching('sd-matching');
    setupQuizzes();
    setupPanels();
  });
})();