/* eslint-disable no-unused-vars */
// Path: src/pages/account/CardsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Tag, GraduationCap, CheckCircle2, Clock, Upload, Trash2 } from 'lucide-react';
import accountService from '../../services/accountService';

const CardsPage = () => {
  const [cards, setCards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // State form thẻ sinh viên
  const [studentForm, setStudentForm] = useState({ studentId: '', university: '', major: '', expiresAt: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await accountService.getCards();
      setCards(res.data);
    } catch (error) {
      console.error("Failed to fetch cards", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please upload your student ID card image.");
    
    try {
      const formData = new FormData();
      formData.append('studentId', studentForm.studentId);
      formData.append('university', studentForm.university);
      formData.append('major', studentForm.major);
      formData.append('expiresAt', studentForm.expiresAt);
      formData.append('cardImage', selectedFile);

      await accountService.submitStudentCard(formData);
      alert("Student card submitted for verification!");
      fetchCards();
    } catch (error) {
      alert("Failed to submit student card.");
    }
  };

  const handleDeleteStudent = async () => {
    if(window.confirm("Are you sure you want to remove your student card verification?")) {
      try {
        await accountService.deleteStudentCard();
        setStudentForm({ studentId: '', university: '', major: '', expiresAt: '' });
        setSelectedFile(null);
        setFilePreview(null);
        fetchCards();
      } catch (error) {
        alert("Failed to delete card.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Tag className="text-indigo-600" /> Cards & Offers
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your discount cards and active vouchers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* STUDENT CARD SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-blue-500" size={24} />
              <h2 className="font-bold text-lg text-slate-800">Student Card</h2>
            </div>
            {cards.studentCard?.verified ? (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 size={14} /> Verified</span>
            ) : cards.studentCard?.studentId ? (
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><Clock size={14} /> Pending</span>
            ) : null}
          </div>

          {!cards.studentCard?.studentId ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">Verify your student status to get up to 51% off on standard tickets.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">University / College</label>
                  <input required type="text" value={studentForm.university} onChange={e => setStudentForm({...studentForm, university: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-indigo-600 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID</label>
                  <input required type="text" value={studentForm.studentId} onChange={e => setStudentForm({...studentForm, studentId: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-indigo-600 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until</label>
                  <input required type="date" value={studentForm.expiresAt} onChange={e => setStudentForm({...studentForm, expiresAt: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-indigo-600 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Upload ID Photo</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative"
                >
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs font-medium">Click to upload photo</span>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2">
                Submit for Verification
              </button>
            </form>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-2 text-sm text-slate-700 mb-4">
                <p><span className="text-slate-400 font-medium w-24 inline-block">University:</span> <strong className="text-slate-800">{cards.studentCard.university}</strong></p>
                <p><span className="text-slate-400 font-medium w-24 inline-block">Student ID:</span> <strong className="text-slate-800">{cards.studentCard.studentId}</strong></p>
                <p><span className="text-slate-400 font-medium w-24 inline-block">Valid Until:</span> <strong className="text-slate-800">{new Date(cards.studentCard.expiresAt).toLocaleDateString()}</strong></p>
              </div>
              <button onClick={handleDeleteStudent} className="text-red-500 text-sm font-bold hover:underline flex items-center gap-1">
                <Trash2 size={14} /> Remove Card
              </button>
            </div>
          )}
        </div>

        {/* SENIOR CARD SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-bold text-lg text-slate-800">Senior Citizen Card</h2>
            {cards.seniorCard?.verified && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded"><CheckCircle2 size={14} className="inline mr-1"/> Verified</span>}
          </div>
          <p className="text-sm text-slate-500 mb-4">Passengers aged 60 and over are entitled to a 30% discount on standard ticket prices.</p>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-800 text-sm">
            Status is automatically verified based on the Date of Birth provided in your <a href="/account/profile" className="font-bold hover:underline">Profile</a>.
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardsPage;