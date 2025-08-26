import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { history, userMessage } = await req.json();

  const HF_API_TOKEN = process.env.HF_API_KEY;
  const HF_MODEL = process.env.HF_MODEL_ID;

  if (!HF_API_TOKEN || !HF_MODEL) {
    return NextResponse.json(
      { error: 'Hugging Face API Key 또는 모델 ID가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // 프롬프트 구성: 멀티턴 히스토리 반영
  const prompt =
    (history && history.length
      ? history
          .map(
            (turn: any) =>
              `User: ${turn.user}\nBot: ${turn.bot}`
          )
          .join('\n') + '\n'
      : '') + `User: ${userMessage}\nBot:`;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 128, do_sample: true },
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Hugging Face API 호출에 실패했습니다.' },
      { status: 500 }
    );
  }

  const data = await response.json();

  // 모델 응답 파싱
  let botReply = '';
  if (data && Array.isArray(data)) {
    // 일부 모델은 배열로 반환
    botReply = data[0]?.generated_text?.split('Bot:').pop()?.trim() || '';
  } else if (data?.generated_text) {
    botReply = data.generated_text.split('Bot:').pop()?.trim() || '';
  }

  if (!botReply) {
    botReply = '답변을 생성할 수 없습니다.';
  }

  return NextResponse.json({ botReply });
}