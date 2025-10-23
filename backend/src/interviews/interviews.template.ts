export const InterviewInitializationPrompt = `
    {dynamicTemplate}
    Now, based on the following information, I would like you to ask the first interview question to the candidate:
    - Candidate name: {candidateName}
    - Chat history: {interviewMessageHistory}

    Previous questions list is currently empty. You can start the interview by asking the first question.
    - Previous questions asked: {previousQuestions}
    When providing your response, please format it as follows:
    {formattingInstructions}
    Do not provide response in formats other than JSON. Also don't provide response in markdown syntax. Provide the response in the following JSON format:
    {{
      "question": "Your interview question here",
      "pretext": "A user-friendly introduction or context for the question"
    }}

    {answer}
`

export const InterviewOngoingPrompt = `
    {dynamicTemplate}
    continue the interview based on the instructions provided. 

    - Candidate name: {candidateName}
    - Chat history: {interviewMessageHistory}
    - user answer for the previous question: {answer}
    - Response format instructions: {formattingInstructions}

    If user provided an irrelevant answer, provide a feedback and move onto another question. 
    You must not ask the same questions again.
    - Previous questions asked: {questionList}
    Do not provide response in formats other than JSON. Also don't provide response in markdown syntax. Provide the response in the following JSON format:
    {{
      "question": "Your interview question here",
      "pretext": "Brief feedback here"
    }}

    Please proceed accordingly.
`;

export const InterviewNotAnsweredPrompt = `
    {dynamicTemplate}
    unfortunately user didn't able to answer you provided question, continue the interview with another question based on the instructions provided.
    - Candidate name: {candidateName}
    - Chat history: {interviewMessageHistory}
    - Response format instructions: {formattingInstructions}
    You must not ask the same questions again.
    - Previous questions asked: {questionList}

    Do not provide response in formats other than JSON. Also don't provide response in markdown syntax. Provide the response in the following JSON format:
    {{
      "question": "Your interview question here",
      "pretext": "Brief feedback here"
    }}
    {answer} 
    Please proceed accordingly.
`;

export const InterviewEndPrompt = `
    {dynamicTemplate}
    now you reach to the end of the interview because time is over so provide a feedback for previous question and end the interview with a user-friendly message. do not ask any question.    
            
    - Candidate name: {candidateName}
    - Chat history: {interviewMessageHistory}
    - user answer for the previous question: {answer}
    Below previous questions asked is here as a placeholder. Don't refer to this in the response.
    - Previous questions asked: {questionList}

    Do not provide response in formats other than JSON. Also don't provide response in markdown syntax. Provide the response in the following format:
    {formattingInstructions}

    Please proceed accordingly.
`;