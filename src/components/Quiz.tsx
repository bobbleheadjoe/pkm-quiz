import { useQuizStore } from '../store/quizStore';
import WelcomeScreen from './WelcomeScreen';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import EmailGate from './EmailGate';
import ResultsScreen from './ResultsScreen';

export default function Quiz() {
  const screen = useQuizStore((s) => s.screen);

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {screen === 'welcome' && (
          <div className="fade-in">
            <WelcomeScreen />
          </div>
        )}

        {screen === 'questions' && (
          <div>
            <ProgressBar />
            <QuestionCard />
          </div>
        )}

        {screen === 'email' && (
          <div className="fade-in">
            <EmailGate />
          </div>
        )}

        {screen === 'results' && (
          <div className="fade-in">
            <ResultsScreen />
          </div>
        )}
      </div>
    </div>
  );
}
