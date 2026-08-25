import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Question, QuestionType, ChapterType } from '../../types';

interface QuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onSave: (questionData: Question) => void;
  nextNumber: number;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  question,
  onClose,
  onSave,
  nextNumber,
}) => {
  const [type, setType] = useState<QuestionType>('pg');
  const [chapter, setChapter] = useState<ChapterType>('Bab 1');
  const [titleTopic, setTitleTopic] = useState<string>('');
  const [arabicText, setArabicText] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [scoreWeight, setScoreWeight] = useState<number>(5);
  const [rubricGuide, setRubricGuide] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (question) {
      setType(question.type);
      setChapter(question.chapter);
      setTitleTopic(question.titleTopic || '');
      setArabicText(question.arabicText || '');
      setTranslation(question.translation || '');
      setQuestionText(question.questionText || '');
      setCorrectAnswer(question.correctAnswer || 'A');
      setScoreWeight(question.scoreWeight || (question.type === 'pg' ? 5 : 10));
      setRubricGuide(question.rubricGuide || '');
      setExplanation(question.explanation || '');

      if (question.options && question.options.length >= 4) {
        setOptA(question.options[0].text);
        setOptB(question.options[1].text);
        setOptC(question.options[2].text);
        setOptD(question.options[3].text);
      }
    } else {
      setType('pg');
      setChapter('Bab 1');
      setTitleTopic('');
      setArabicText('');
      setTranslation('');
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectAnswer('A');
      setScoreWeight(5);
      setRubricGuide('');
      setExplanation('');
    }
    setError('');
  }, [question, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!questionText.trim()) {
      setError('Teks pertanyaan wajib diisi.');
      return;
    }

    if (type === 'pg') {
      if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
        setError('Keempat pilihan jawaban (A, B, C, D) wajib diisi.');
        return;
      }
    }

    const payload: Question = {
      id: question ? question.id : Date.now(),
      number: question ? question.number : nextNumber,
      type,
      chapter,
      titleTopic: titleTopic.trim() || `Materi ${chapter}`,
      arabicText: arabicText.trim() || undefined,
      translation: translation.trim() || undefined,
      questionText: questionText.trim(),
      scoreWeight: Number(scoreWeight) || (type === 'pg' ? 5 : 10),
      explanation: explanation.trim() || undefined,
      rubricGuide: type === 'essay' ? rubricGuide.trim() : undefined,
      options:
        type === 'pg'
          ? [
              { key: 'A', text: optA.trim() },
              { key: 'B', text: optB.trim() },
              { key: 'C', text: optC.trim() },
              { key: 'D', text: optD.trim() },
            ]
          : undefined,
      correctAnswer: type === 'pg' ? correctAnswer : undefined,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-[#E1E8E2] my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#1B4332]">
                {question ? `Edit Soal Nomor ${question.number}` : `Tambah Soal Baru (Nomor ${nextNumber})`}
              </h3>
              <p className="text-[11px] text-[#55655B]">
                Kelola butir soal ujian Tauhid berbasis Kitab Tauhid Bab 1 - Bab 5
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#55655B] hover:text-[#1B4332] hover:bg-[#F1F5F2] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[#D63031] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D63031] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
          
          {/* Row 1: Type, Chapter, Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
                Tipe Soal
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestionType)}
                className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-semibold text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F]"
              >
                <option value="pg">Pilihan Ganda (PG)</option>
                <option value="essay">Soal Esai (Uraian)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
                Bab Materi
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value as ChapterType)}
                className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-semibold text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F]"
              >
                <option value="Bab 1">Bab 1: Kewajiban Bertauhid</option>
                <option value="Bab 2">Bab 2: Keutamaan Tauhid</option>
                <option value="Bab 3">Bab 3: Tahqiqut Tauhid (Tanpa Hisab)</option>
                <option value="Bab 4">Bab 4: Takut Terhadap Syirik</option>
                <option value="Bab 5">Bab 5: Dakwah Menuju Syahadat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
                Bobot Poin
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={scoreWeight}
                onChange={(e) => setScoreWeight(Number(e.target.value))}
                className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg font-bold text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F]"
              />
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
              Topik / Judul Materi
            </label>
            <input
              type="text"
              value={titleTopic}
              onChange={(e) => setTitleTopic(e.target.value)}
              placeholder="Contoh: Makna Hadits Mu'adz bin Jabal tentang Hak Allah"
              className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </div>

          {/* Arabic Matan / Dalil */}
          <div>
            <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1 flex items-center justify-between">
              <span>Teks Matan Arab / Dalil (Opsional)</span>
              <span className="text-[#2D6A4F] font-semibold text-[10px]">Mendukung Harakat & Font Arab</span>
            </label>
            <textarea
              rows={2}
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              placeholder="وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ"
              className="w-full p-2.5 bg-white border border-[#95D5B2] rounded-lg font-arabic text-base text-[#1B4332] font-bold focus:ring-1 focus:ring-[#2D6A4F] text-right"
              dir="rtl"
            />
          </div>

          {/* Translation */}
          <div>
            <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
              Terjemahan / Konteks Dalil (Opsional)
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Contoh: 'Dan Aku tidak menciptakan jin dan manusia melainkan agar mereka beribadah kepada-Ku' (QS. Adz-Dzariyat: 56)"
              className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F] italic"
            />
          </div>

          {/* Question Body */}
          <div>
            <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
              Teks Pertanyaan
            </label>
            <textarea
              rows={2}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Tuliskan pertanyaan dengan jelas..."
              className="w-full p-2.5 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-[#2D3436] text-xs focus:ring-1 focus:ring-[#2D6A4F] font-medium"
            />
          </div>

          {/* Options for PG */}
          {type === 'pg' && (
            <div className="p-3 bg-[#F7FCF8] border border-[#E1E8E2] rounded-xl space-y-2.5">
              <span className="font-bold text-[#1B4332] block text-[11px]">
                Pilihan Jawaban & Kunci:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#E1E8E2] font-bold text-[10px] flex items-center justify-center text-[#1B4332]">A</span>
                  <input
                    type="text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Pilihan A"
                    className="flex-1 p-1.5 bg-white border border-[#E1E8E2] rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#E1E8E2] font-bold text-[10px] flex items-center justify-center text-[#1B4332]">B</span>
                  <input
                    type="text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Pilihan B"
                    className="flex-1 p-1.5 bg-white border border-[#E1E8E2] rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#E1E8E2] font-bold text-[10px] flex items-center justify-center text-[#1B4332]">C</span>
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Pilihan C"
                    className="flex-1 p-1.5 bg-white border border-[#E1E8E2] rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#E1E8E2] font-bold text-[10px] flex items-center justify-center text-[#1B4332]">D</span>
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Pilihan D"
                    className="flex-1 p-1.5 bg-white border border-[#E1E8E2] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E1E8E2] flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#1B4332]">
                  Kunci Jawaban Benar:
                </label>
                <div className="flex items-center gap-1.5">
                  {(['A', 'B', 'C', 'D'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setCorrectAnswer(k)}
                      className={`w-7 h-7 rounded-lg font-extrabold text-xs transition-all cursor-pointer ${
                        correctAnswer === k
                          ? 'bg-[#2D6A4F] text-white shadow-2xs'
                          : 'bg-white border border-[#E1E8E2] text-[#55655B] hover:bg-[#F1F5F2]'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rubric for Essay */}
          {type === 'essay' && (
            <div>
              <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
                Pedoman Rubrik Penilaian Guru
              </label>
              <textarea
                rows={2}
                value={rubricGuide}
                onChange={(e) => setRubricGuide(e.target.value)}
                placeholder="Rincian poin penilaian untuk memeriksa jawaban siswa..."
                className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-[#2D3436] text-xs"
              />
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block font-bold text-[#1B4332] uppercase tracking-wider text-[10px] mb-1">
              Penjelasan / Pembahasan Soal
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Penjelasan ringkas materi dan dalil..."
              className="w-full p-2 bg-[#F7FCF8] border border-[#E1E8E2] rounded-lg text-[#2D3436] text-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#E1E8E2] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg font-semibold text-xs text-[#55655B] hover:bg-[#F1F5F2] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg font-bold text-xs text-white bg-[#2D6A4F] hover:bg-[#1B4332] shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Soal</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
