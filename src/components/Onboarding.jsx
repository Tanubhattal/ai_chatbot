const Onboarding = ({ onComplete }) => {
  return (
    <div className="onboarding-container">
      <div className="assessment-card">
        <div className="card-header gradient-header">
          <h2 className="page-title">Personal Wellness Assessment</h2>
          <p className="page-subtitle">Let's tailor your AI journey.</p>
        </div>
        <form className="assessment-form" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = {
            name: formData.get('name'),
            age: formData.get('age') || '25',
            sleep: formData.get('sleep') || '7',
            stressor: formData.get('stressor') || 'Work',
            focus: formData.get('focus') || '',
            mood: formData.get('mood') || 'Calm'
          };
          onComplete(data);
        }}>
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" required type="text" className="form-input" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input name="age" required type="number" className="form-input" placeholder="Your age" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Wellness Profile</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Sleep Hours</label>
                <input name="sleep" type="number" className="form-input" placeholder="Hours per night" />
              </div>
              <div className="form-group">
                <label>Main Stressor</label>
                <select name="stressor" className="form-select">
                  <option value="Work">Work</option>
                  <option value="Relationships">Relationships</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Current Mood</label>
                <select name="mood" className="form-select">
                  <option value="Calm">Calm 😌</option>
                  <option value="Anxious">Anxious 😰</option>
                  <option value="Stressed">Stressed 😤</option>
                  <option value="Happy">Happy 😊</option>
                  <option value="Sad">Sad 😢</option>
                  <option value="Neutral">Neutral 😐</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Focus Area (optional)</label>
                <textarea name="focus" className="textarea-large" placeholder="What would you like to work on most?" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-fullwidth">
              Generate My AI Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
