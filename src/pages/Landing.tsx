import { Link } from 'react-router-dom';
import '../style/landing.css';

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing__hero">
        <h1>גמ"ח שכונתי 🤝</h1>
        <p className="landing__subtitle">
          משאילות, שואלות ועוזרות אחת לשנייה, בכל שכונות בני ברק
        </p>

        <div className="landing__buttons">
          <Link to="/register" className="landing__btn landing__btn--primary">
            הרשמה
          </Link>
          <Link to="/login" className="landing__btn landing__btn--secondary">
            כבר יש לי חשבון
          </Link>
        </div>
      </div>

      <div className="landing__features">
        <div className="landing__feature">
          <span className="landing__icon">📦</span>
          <h3>מפרסמות</h3>
          <p>עגלה, כלי אירוח, ספרים או כלי עבודה שמחכים בבית? שתפי אותם עם השכנות.</p>
        </div>
        <div className="landing__feature">
          <span className="landing__icon">🙋‍♀️</span>
          <h3>מבקשות</h3>
          <p>מצאת משהו שאת צריכה? שלחי בקשה לתאריכים שמתאימים לך.</p>
        </div>
        <div className="landing__feature">
          <span className="landing__icon">💜</span>
          <h3>עוזרות</h3>
          <p>אחרי אישור, מתאמות איסוף, משתמשות ומחזירות. פשוט ככה.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;