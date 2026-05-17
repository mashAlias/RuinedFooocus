import { useMemo, useState } from 'react';
import alphabet from './data/alphabetData.json';

const views = ['home', 'letters', 'letter', 'games', 'parents'];

const speak = (text, enabled) => {
  if (!enabled || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'it-IT';
  window.speechSynthesis.speak(u);
};

function WordCard({ item, audioOn }) {
  return <div className="card"><div className="text-4xl">{item.image}</div><p className="font-black text-xl">{item.upper}</p><p>{item.word}</p><p className="text-sm text-slate-600">{item.sentence}</p><button className="big-btn bg-cyan-200 mt-2" onClick={() => speak(item.word, audioOn)}>🔊 Ascolta</button></div>;
}

function App() {
  const [view, setView] = useState('home');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [audioOn, setAudioOn] = useState(true);
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('aa-progress') || '{"completed":[],"stars":0,"games":0}'));

  const letterData = alphabet.data[selectedLetter];
  const saveProgress = (next) => { setProgress(next); localStorage.setItem('aa-progress', JSON.stringify(next)); };

  const completeLetter = () => {
    const completed = Array.from(new Set([...progress.completed, selectedLetter]));
    saveProgress({ ...progress, completed, stars: progress.stars + 3 });
  };

  const gameView = useMemo(() => {
    const words = Object.values(letterData.categories).flat().slice(0, 4);
    const target = words[0];
    return <div className="card space-y-3">
      <h3 className="text-2xl font-bold">1) Trova la parola giusta</h3>
      <p>Quale parola inizia con {selectedLetter}?</p>
      <div className="grid grid-cols-2 gap-2">{words.map((w) => <button key={w.word} onClick={() => alert(w.word === target.word ? `Bravo! ${w.word} inizia con ${selectedLetter}!` : 'Riprova! Ascolta bene il suono iniziale.')} className="big-btn bg-emerald-100">{w.image} {w.word}</button>)}</div>
      <h3 className="text-2xl font-bold pt-4">2) Completa la parola</h3>
      <p>{target.upper.replace(selectedLetter, '_')}</p>
      <div className="flex gap-2">{[selectedLetter, 'M', 'S'].map((l) => <button key={l} className="big-btn bg-amber-200" onClick={() => alert(l === selectedLetter ? 'Corretto!' : 'Quasi, riprova!')}>{l}</button>)}</div>
      <h3 className="text-2xl font-bold pt-4">3) Dividi in categorie</h3>
      <p>Dove metti la parola “{target.word}”?</p>
      <div className="flex flex-wrap gap-2">{Object.keys(letterData.categories).map((c) => <button key={c} className="big-btn bg-fuchsia-200" onClick={() => alert(letterData.categories[c].some(i => i.word === target.word) ? 'Giusto!' : 'Riprova!')}>{c}</button>)}</div>
    </div>;
  }, [letterData, selectedLetter]);

  return <main className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-100 p-4 md:p-8">
    <div className="max-w-6xl mx-auto space-y-4">
      <header className="card flex flex-wrap justify-between items-center gap-3"><h1 className="text-3xl md:text-4xl font-black">🦉 Alfabeto Avventura</h1><button className="big-btn bg-slate-200" onClick={() => setAudioOn(!audioOn)}>{audioOn ? 'Audio ON' : 'Audio OFF'}</button></header>

      {view === 'home' && <section className="card text-center space-y-4"><p className="text-xl">Impara le parole giocando con lettere, animali, frutti, verdure e mestieri</p><p className="text-6xl">🤖</p><div className="flex flex-wrap justify-center gap-2"><button className="big-btn bg-green-300" onClick={() => setView('games')}>Inizia</button><button className="big-btn bg-blue-300" onClick={() => setView('letters')}>Scegli una lettera</button><button className="big-btn bg-purple-300" onClick={() => setView('parents')}>Area genitori/insegnanti</button></div></section>}

      {view === 'letters' && <section className="card"><h2 className="text-2xl font-bold mb-4">Scegli una lettera</h2><div className="grid grid-cols-4 md:grid-cols-7 gap-2">{alphabet.letters.map((l) => <button key={l} className="big-btn bg-orange-200" onClick={() => { setSelectedLetter(l); setView('letter'); }}>{l}</button>)}</div></section>}

      {view === 'letter' && <section className="space-y-4"><div className="card"><h2 className="text-5xl font-black">{letterData.letter} {letterData.lower}</h2><button className="big-btn bg-cyan-200 mt-2" onClick={() => speak(letterData.letter, audioOn)}>🔊 Pronuncia lettera</button><p className="text-sm mt-2">{alphabet.notes[letterData.letter] || 'Parole concrete e facili da visualizzare.'}</p></div>{Object.entries(letterData.categories).map(([cat, items]) => <div key={cat} className="card"><h3 className="text-2xl font-bold capitalize">{cat}</h3><div className="grid md:grid-cols-4 gap-3 mt-2">{items.map((item) => <WordCard key={item.word} item={item} audioOn={audioOn} />)}</div></div>)}<div className="card"><h3 className="font-bold text-xl">📖 Libro della lettera</h3><p>{letterData.storybook}</p><button className="big-btn bg-lime-300 mt-2" onClick={completeLetter}>Completa lettera (+adesivo)</button></div></section>}

      {view === 'games' && gameView}

      {view === 'parents' && <section className="card space-y-2"><h2 className="text-2xl font-bold">Area genitori/insegnanti</h2><p>Stelle: {progress.stars}</p><p>Lettere completate: {progress.completed.join(', ') || 'Nessuna'}</p><p>Giochi svolti: {progress.games}</p><p>Lettere da ripassare: {alphabet.letters.filter((l) => !progress.completed.includes(l)).slice(0, 5).join(', ')}</p><ul className="list-disc pl-6"><li>Cercare in casa 5 oggetti che iniziano con una lettera.</li><li>Disegnare un animale che inizia con B.</li><li>Inventare una frase con tre parole della stessa lettera.</li><li>Fare una caccia al tesoro alfabetica.</li></ul></section>}

      <footer className="flex gap-2 flex-wrap">{views.filter(v => v !== view).map(v => <button key={v} className="big-btn bg-white" onClick={() => setView(v)}>{v}</button>)}</footer>
    </div>
  </main>;
}

export default App;
