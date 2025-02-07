import React, { useCallback, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [page, setPage] = useState('ONE');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState(null);
  const [answer3, setAnswer3] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const handleOptionChange = useCallback(ev => {
    setAnswer2(ev.currentTarget.value);
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasSent = useRef(false);
  useEffect(() => {
    if (page === 'FINISH' && !loading && !hasSent.current) {
      setLoading(true);
      hasSent.current = true;
      axios
        .post('/api/save', {
          answers: [age, gender, answer1, answer2, answer3].map(value =>
            value === null ? '' : value
          ),
        })
        .then(function(response) {
          console.log('@response', response);
          setLoading(false);
        })
        .catch(function(error) {
          hasSent.current = false;
          console.log(error);
          setLoading(false);
          setError(error);
        });
    }
  }, [age, answer1, answer2, answer3, gender, loading, page]);
  return (
    <div className="App">
      {page === 'ONE' && (
        <div>
          <p>
            Ålder:{' '}
            <input
              type="text"
              value={age}
              onChange={ev => {
                setAge(ev.currentTarget.value);
              }}
            />
          </p>
          <p>
            Kön:{' '}
            <input
              type="text"
              value={gender}
              onChange={ev => {
                setGender(ev.currentTarget.value);
              }}
            />
          </p>
          <p style={{ marginTop: '64px' }}>
            En person gick in i en affär. Där köpte{' '}
            <input
              type="text"
              value={answer1}
              onChange={ev => {
                setAnswer1(ev.currentTarget.value);
              }}
            />{' '}
            ett äpple.
          </p>
          <p>
            <button
              onClick={() => {
                if (!age || !gender || !answer1) {
                  return;
                }
                if (answer1.toLowerCase().replace(/\s/gm, '') === 'hen') {
                  setPage('FINISH');
                } else {
                  setPage('TWO');
                }
              }}
              disabled={!age || !gender || !answer1}
            >
              Vidare
            </button>
          </p>
        </div>
      )}
      {page === 'TWO' && (
        <div>
          Skulle du kunna tänka dig att använda ordet hen?
          <form>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="JA"
                  checked={answer2 === 'JA'}
                  onChange={handleOptionChange}
                />
                Ja
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="NEJ"
                  checked={answer2 === 'NEJ'}
                  onChange={handleOptionChange}
                />
                Nej
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="KANSKE"
                  checked={answer2 === 'KANSKE'}
                  onChange={handleOptionChange}
                />
                Kanske
              </label>
            </div>
          </form>
          <p>
            <button
              onClick={() => {
                if (!answer2) {
                  return;
                }
                if (answer2 === 'NEJ') {
                  setPage('THREE');
                } else {
                  setPage('FINISH');
                }
              }}
              disabled={!answer2}
            >
              Vidare
            </button>
          </p>
        </div>
      )}
      {page === 'THREE' && (
        <div>
          Varför inte?
          <div>
            <textarea
              name="whynot"
              cols="30"
              rows="10"
              onChange={ev => {
                setAnswer3(ev.currentTarget.value);
              }}
            ></textarea>
          </div>
          <p>
            <button
              onClick={() => {
                if (!answer3) {
                  return;
                }
                setPage('FINISH');
              }}
              disabled={!answer3}
            >
              Vidare
            </button>
          </p>
        </div>
      )}
      {page === 'FINISH' && (
        <div>
          {error && (
            <div style={{ color: 'red' }}>
              Rapportera detta fel: {error}
              <br />
            </div>
          )}
          {loading ? (
            'Skickar in ' + (answer1 === 'hen' ? 'ditt' : 'dina') + ' svar...'
          ) : (
            <div>Tack för {answer1 === 'hen' ? 'ditt' : 'dina'} svar!</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
