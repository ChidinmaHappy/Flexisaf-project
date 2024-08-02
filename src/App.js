//Third one with more features


import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function BmiCalculator() {
  const [heightValue, setHeightValue] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [bmiValue, setBmiValue] = useState('');
  const [bmiMessage, setBmiMessage] = useState('');
  const [tips, setTips] = useState({});
  const [showTips, setShowTips] = useState(false);
  const [tipType, setTipType] = useState('both'); // Added state for tip type
  const [pastTips, setPastTips] = useState([]); // Added state for past tips

  useEffect(() => {
    const savedTips = JSON.parse(localStorage.getItem('dailyTips')) || []; // Load past tips from localStorage
    setPastTips(savedTips);
  }, []);

  const calculateBmi = () => {
    if (heightValue && weightValue) {
      const heightInMeters = heightValue / 100;
      const bmi = (weightValue / (heightInMeters * heightInMeters)).toFixed(2);
      setBmiValue(bmi);

      let message = '';
      if (bmi < 18.5) {
        message = 'You are Underweight';
      } else if (bmi >= 18.5 && bmi < 25) {
        message = 'You are Normal weight';
      } else if (bmi >= 25 && bmi < 30) {
        message = 'You are Overweight';
      } else {
        message = 'You are Obese';
      }
      setBmiMessage(message);
      setShowTips(false); // Reset tips visibility when BMI is recalculated
    } else {
      setBmiValue('');
      setBmiMessage('');
      setTips({});
      setShowTips(false); // Reset tips visibility when inputs are empty
    }
  };

  const fetchTips = () => {
    let exerciseTips = '';
    let dietTips = '';

    const bmi = parseFloat(bmiValue); // Convert bmiValue to a number
    if (bmi < 18.5) {
      exerciseTips = 'Focus on strength training exercises to build muscle mass. Avoid excessive cardio.';
      dietTips = 'Increase your calorie intake with nutrient-dense foods like nuts, seeds, lean meats, and whole grains.';
    } else if (bmi >= 18.5 && bmi < 25) {
      exerciseTips = 'Maintain a balanced workout routine including cardio, strength training, and flexibility exercises.';
      dietTips = 'Continue with a balanced diet that includes a variety of foods from all food groups.';
    } else if (bmi >= 25 && bmi < 30) {
      exerciseTips = 'Incorporate more cardio exercises like running, cycling, or swimming. Combine with strength training.';
      dietTips = 'Focus on portion control and include more fruits, vegetables, and lean proteins in your diet.';
    } else {
      exerciseTips = 'Start with low-impact cardio exercises like walking or swimming. Gradually increase intensity.';
      dietTips = 'Consult with a healthcare provider for a personalized diet plan. Aim for low-calorie, nutrient-dense foods.';
    }

    const currentTips = {
      exerciseTips: tipType === 'exercise' || tipType === 'both' ? exerciseTips : '', // Use tipType state
      dietTips: tipType === 'diet' || tipType === 'both' ? dietTips : '' // Use tipType state
    };

    setTips(currentTips);
    setShowTips(true);

    // Save today's tips to localStorage
    const date = new Date().toLocaleDateString();
    const savedTips = JSON.parse(localStorage.getItem('dailyTips')) || [];
    if (!savedTips.find(tip => tip.date === date)) {
      savedTips.push({ date, tips: currentTips });
      if (savedTips.length > 7) {
        savedTips.shift(); // Keep only the last 7 days
      }
      localStorage.setItem('dailyTips', JSON.stringify(savedTips));
      setPastTips(savedTips);
    }
  };

  return (
    <Container>
      <Title> BMI Calculator</Title>
      <InputContainer>
        <Label htmlFor="height">Enter Your Height (cm):</Label>
        <Input
          type="number"
          id="height"
          value={heightValue}
          onChange={(e) => setHeightValue(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label htmlFor="weight">Enter Your Weight (kg):</Label>
        <Input
          type="number"
          id="weight"
          value={weightValue}
          onChange={(e) => setWeightValue(e.target.value)}
        />
      </InputContainer>
      <Button onClick={calculateBmi}>Click to Calculate BMI</Button>
      {bmiValue && bmiMessage && (
        <Result>
          <p>
            Your BMI: <BmiValue>{bmiValue}</BmiValue>
          </p>
          <p>
            Result: <BmiMessage>{bmiMessage}</BmiMessage>
          </p>
          <TipSelector> {/* Added dropdown for selecting tip type */}
            <Label htmlFor="tipType">Select Tip Type:</Label>
            <Select
              id="tipType"
              value={tipType}
              onChange={(e) => setTipType(e.target.value)}
            >
              <option value="both">Both</option>
              <option value="exercise">Exercise</option>
              <option value="diet">Diet</option>
            </Select>
          </TipSelector>
          <TipsButton onClick={fetchTips}>Get Tips</TipsButton>
          {showTips && tips && (
            <Tips>
              {tips.exerciseTips && (
                <>
                  <h3>Exercise Tips:</h3>
                  <p>{tips.exerciseTips}</p>
                </>
              )}
              {tips.dietTips && (
                <>
                  <h3>Diet Tips:</h3>
                  <p>{tips.dietTips}</p>
                </>
              )}
            </Tips>
          )}
        </Result>
      )}
      <PastTipsButton onClick={() => setShowTips(!showTips)}>View Past Tips</PastTipsButton> {/* Added button to show past tips */}
      {showTips && (
        <PastTips>
          <h3>Past 7 Days Tips:</h3>
          {pastTips.map((tip, index) => (
            <TipCard key={index}> {/* Use TipCard to display past tips */}
              <h4>{tip.date}</h4>
              {tip.tips.exerciseTips && (
                <>
                  <h5>Exercise Tips:</h5>
                  <p>{tip.tips.exerciseTips}</p>
                </>
              )}
              {tip.tips.dietTips && (
                <>
                  <h5>Diet Tips:</h5>
                  <p>{tip.tips.dietTips}</p>
                </>
              )}
            </TipCard>
          ))}
        </PastTips>
      )}
    </Container>
  );
}

export default BmiCalculator;

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: cyan;
  text-align: center;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 94%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid beige;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const Result = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const BmiValue = styled.span`
  font-weight: bold;
`;

const BmiMessage = styled.span`
  color: #007bff;
  font-weight: bold;
`;

const TipSelector = styled.div` /* Added styling for TipSelector */
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const Select = styled.select` /* Added styling for Select */
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
`;

const TipsButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const Tips = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const PastTipsButton = styled.button` /* Added styling for PastTipsButton */
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #6c757d;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const PastTips = styled.div` /* Added styling for PastTips */
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const TipCard = styled.div` /* Added styling for TipCard */
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
`;




// //Second

// import React, { useState } from 'react';
// import styled from 'styled-components';

// function BmiCalculator() {
//   const [heightValue, setHeightValue] = useState('');
//   const [weightValue, setWeightValue] = useState('');
//   const [bmiValue, setBmiValue] = useState('');
//   const [bmiMessage, setBmiMessage] = useState('');
//   const [tips, setTips] = useState('');
//   const [showTips, setShowTips] = useState(false);

//   const calculateBmi = () => {
//     if (heightValue && weightValue) {
//       const heightInMeters = heightValue / 100;
//       const bmi = (weightValue / (heightInMeters * heightInMeters)).toFixed(2);
//       setBmiValue(bmi);

//       let message = '';
//       if (bmi < 18.5) {
//         message = 'You are Underweight';
//       } else if (bmi >= 18.5 && bmi < 25) {
//         message = 'You are Normal weight';
//       } else if (bmi >= 25 && bmi < 30) {
//         message = 'You are Overweight';
//       } else {
//         message = 'You are Obese';
//       }
//       setBmiMessage(message);
//       setShowTips(false); // Reset tips visibility when BMI is recalculated
//     } else {
//       setBmiValue('');
//       setBmiMessage('');
//       setTips('');
//       setShowTips(false); // Reset tips visibility when inputs are empty
//     }
//   };

//   const fetchTips = () => {
//     let exerciseTips = '';
//     let dietTips = '';

//     const bmi = parseFloat(bmiValue); // Convert bmiValue to a number
//     if (bmi < 18.5) {
//       exerciseTips = 'Focus on strength training exercises to build muscle mass. Avoid excessive cardio.';
//       dietTips = 'Increase your calorie intake with nutrient-dense foods like nuts, seeds, lean meats, and whole grains.';
//     } else if (bmi >= 18.5 && bmi < 25) {
//       exerciseTips = 'Maintain a balanced workout routine including cardio, strength training, and flexibility exercises.';
//       dietTips = 'Continue with a balanced diet that includes a variety of foods from all food groups.';
//     } else if (bmi >= 25 && bmi < 30) {
//       exerciseTips = 'Incorporate more cardio exercises like running, cycling, or swimming. Combine with strength training.';
//       dietTips = 'Focus on portion control and include more fruits, vegetables, and lean proteins in your diet.';
//     } else {
//       exerciseTips = 'Start with low-impact cardio exercises like walking or swimming. Gradually increase intensity.';
//       dietTips = 'Consult with a healthcare provider for a personalized diet plan. Aim for low-calorie, nutrient-dense foods.';
//     }

//     setTips({ exerciseTips, dietTips });
//     setShowTips(true);
//   };

//   return (
//     <Container>
//       <Title> BMI Calculator</Title>
//       <InputContainer>
//         <Label htmlFor="height">Enter Your Height (cm):</Label>
//         <Input
//           type="number"
//           id="height"
//           value={heightValue}
//           onChange={(e) => setHeightValue(e.target.value)}
//         />
//       </InputContainer>
//       <InputContainer>
//         <Label htmlFor="weight">Enter Your Weight (kg):</Label>
//         <Input
//           type="number"
//           id="weight"
//           value={weightValue}
//           onChange={(e) => setWeightValue(e.target.value)}
//         />
//       </InputContainer>
//       <Button onClick={calculateBmi}>Click to Calculate BMI</Button>
//       {bmiValue && bmiMessage && (
//         <Result>
//           <p>
//             Your BMI: <BmiValue>{bmiValue}</BmiValue>
//           </p>
//           <p>
//             Result: <BmiMessage>{bmiMessage}</BmiMessage>
//           </p>
//           <TipsButton onClick={fetchTips}>Get Exercise and Diet Tips?</TipsButton>
//           {showTips && tips && (
//             <Tips>
//               <h3>Exercise Tips:</h3>
//               <p>{tips.exerciseTips}</p>
//               <h3>Diet Tips:</h3>
//               <p>{tips.dietTips}</p>
//             </Tips>
//           )}
//         </Result>
//       )}
//     </Container>
//   );
// }

// export default BmiCalculator;

// const Container = styled.div`
//   max-width: 400px;
//   margin: 0 auto;
//   padding: 20px;
// `;

// const Title = styled.h1`
//   color: cyan;
//   text-align: center;
//   margin-bottom: 20px;
// `;

// const InputContainer = styled.div`
//   margin-bottom: 10px;
// `;

// const Label = styled.label`
//   display: block;
//   font-weight: bold;
//   color: #0B3040;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 94%;
//   padding: 10px;
//   font-size: 16px;
//   border: 1px solid beige;
// `;

// const Button = styled.button`
//   display: block;
//   width: 100%;
//   padding: 10px;
//   background-color: #007bff;
//   color: #fff;
//   font-size: 16px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   margin-top: 10px;
// `;

// const Result = styled.div`
//   margin-top: 20px;
//   padding: 10px;
//   background-color: #f0f0f0;
//   border-radius: 4px;
// `;

// const BmiValue = styled.span`
//   font-weight: bold;
// `;

// const BmiMessage = styled.span`
//   color: #0B3040;
//   font-weight: bold;
// `;

// const TipsButton = styled.button`
//   display: block;
//   width: 100%;
//   padding: 10px;
//   background-color: #28a745;
//   color: #fff;
//   font-size: 16px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   margin-top: 10px;
// `;

// const Tips = styled.div`
//   margin-top: 20px;
//   padding: 10px;
//   background-color: #f9f9f9;
//   border-radius: 4px;
  
//   h3 {
//     margin-bottom: 10px;
//     color: #0B3040;
//   }
  
//   p {
//     margin-bottom: 10px;
//     font-size: 15px;
//     line-height: 1.4;
//   }
// `;




// //Main One
// import React, { useState } from 'react';
// import styled from 'styled-components';

// function BmiCalculator() {
//   const [heightValue, setHeightValue] = useState('');
//   const [weightValue, setWeightValue] = useState('');
//   const [bmiValue, setBmiValue] = useState('');
//   const [bmiMessage, setBmiMessage] = useState('');

//   const calculateBmi = () => {
//     if (heightValue && weightValue) {
//       const heightInMeters = heightValue / 100;
//       const bmi = (weightValue / (heightInMeters * heightInMeters)).toFixed(2);
//       setBmiValue(bmi);

//       let message = '';
//       if (bmi < 18.5) {
//         message = 'You are Underweight';
//       } else if (bmi >= 18.5 && bmi < 25) {
//         message = 'You are Normal weight';
//       } else if (bmi >= 25 && bmi < 30) {
//         message = 'You are Overweight';
//       } else {
//         message = 'You are Obese';
//       }
//       setBmiMessage(message);
//     } else {
//       setBmiValue('');
//       setBmiMessage('');
//     }
//   };

//   return (
//     <Container>
//       <Title> BMI Calculator</Title>
//       <InputContainer>
//         <Label htmlFor="height">Enter Your Height (cm):</Label>
//         <Input
//           type="number"
//           id="height"
//           value={heightValue}
//           onChange={(e) => setHeightValue(e.target.value)}
//         />
//       </InputContainer>
//       <InputContainer>
//         <Label htmlFor="weight">Enter Your Weight (kg):</Label>
//         <Input
//           type="number"
//           id="weight"
//           value={weightValue}
//           onChange={(e) => setWeightValue(e.target.value)}
//         />
//       </InputContainer>
//       <Button onClick={calculateBmi}>Click to Calculate BMI</Button>
//       {bmiValue && bmiMessage && (
//         <Result>
//           <p>
//             Your BMI: <BmiValue>{bmiValue}</BmiValue>
//           </p>
//           <p>
//             Result: <BmiMessage>{bmiMessage}</BmiMessage>
//           </p>
//         </Result>
//       )}
//     </Container>
//   );
// }

// export default BmiCalculator;

// const Container = styled.div`
//   max-width: 400px;
//   margin: 0 auto;
//   padding: 20px;
// `;

// const Title = styled.h1`
//   color: cyan;
//   text-align: center;
//   margin-bottom: 20px;
// `;

// const InputContainer = styled.div`
//   margin-bottom: 10px;
// `;

// const Label = styled.label`
//   display: block;
//   font-weight: bold;
//   margin-bottom: 5px;
// `;

// const Input = styled.input`
//   width: 94%;
//   padding: 10px;
//   font-size: 16px;
//   border: 1px solid beige;
  
// `;

// const Button = styled.button`
//   display: block;
//   width: 100%;
//   padding: 10px;
//   background-color: #007bff;
//   color: #fff;
//   font-size: 16px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// `;

// const Result = styled.div`
//   margin-top: 20px;
//   padding: 10px;
//   background-color: #f0f0f0;
//   border-radius: 4px;
// `;

// const BmiValue = styled.span`
//   font-weight: bold;
// `;

// const BmiMessage = styled.span`
//   color: #007bff;
//   font-weight: bold;
// `;
