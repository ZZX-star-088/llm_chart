

const userInput = ref(store.history[0]);
const aiReply = ref('');

export async function sendMessage() {
    if (!userInput.value) return;

    try {
        // 调用你自己的后端接口（地址和后端启动的一致）
        const res = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 把用户输入传给后端
            body: JSON.stringify({ userInput: userInput.value }),
        });

        const data = await res.json();
        aiReply.value = data.reply; // 显示AI的回复
        console.log('回复', aiReply.value)
    } catch (err) {
        aiReply.value = '请求失败，请检查后端是否启动';
    }
}
