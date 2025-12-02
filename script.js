// Gamification: matching games and quizzes for topic pages
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

    // expose reset via data attribute/button if present
    const resetBtn = root.querySelector('[data-action="reset-matching"]');
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
          questions.forEach((qs, idx) => {
            const correctAns = qs.dataset.correct;
            const name = qs.querySelector('input[type="radio"]')?.name;
            const selected = qs.querySelector('input[type="radio":checked');
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

  // initialize matching games by known ids
  document.addEventListener('DOMContentLoaded', ()=>{
    setupMatching('banking-matching');
    setupMatching('taxes-matching');
    setupMatching('sd-matching');
    setupQuizzes();
  });
})();