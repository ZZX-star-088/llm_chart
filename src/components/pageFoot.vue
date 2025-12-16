<template>
    <div class="foot">
<div class="text">
<textarea 
class="input_text"
placeholder="发送消息"
wrap="soft"
v-model="textareavalue"
>
</textarea>
</div>
<div class="bottom">
<div class="micro" title="长按发送语音" @click="startspeech">
    <el-icon><Microphone /></el-icon>
</div>
<div class="cut" title="清空" @click="clear">
<el-icon><Scissor /></el-icon>
</div>
<div class="send" title="发送" :class="{active:hastext}" @click="sendmessage">
<el-icon><Top /></el-icon>
</div>
</div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import {useStore,messageinitial} from '../store/store'
import {ref,computed, onUnmounted} from 'vue'

messageinitial()
const hastext=computed(
    ()=>{
        return textareavalue.value.trim() !== '';
    }
)
const textareavalue=ref('')
//清空
function clear(){
textareavalue.value=('')
console.log('clear',clear)
}
//语音识别
let recognition=null
if(window.SpeechRecognition || window.webkitSpeechRecognition)
{
    const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
    recognition=new SpeechRecognition();
    recognition.lang = 'zh-CN'; // 识别简体中文
    recognition.interimResults = false; // 关闭临时结果（新手先关，避免重复拼接）
    recognition.maxAlternatives = 1; // 只返回1个候选结果
    recognition.continuous = false; // 识别一次语音就停止
    //1.绑定
    recognition.onresult = (event) => {
    const recognizedText = event.results[0][0].transcript;
    textareavalue.value += recognizedText;
    console.log('识别置信度：', event.results[0][0].confidence);
    }
    //2.识别无匹配结果
     recognition.onnomatch = () => {
    ElMessage.warning('未识别到有效语音内容');
     }
     //3.错误处理
    recognition.onerror = (event) => {
    let errorMsg = '语音识别出错：';
    switch (event.error) {
      case 'not-allowed':
        errorMsg += '请授予麦克风权限';
        break;
      case 'no-speech':
        errorMsg += '未检测到语音输入';
        break;
      default:
        errorMsg += event.error;
    }
    ElMessage.error(errorMsg);
  };
  // 5. 语音结束后自动停止识别
  recognition.onspeechend = () => {
    recognition.stop();
    ElMessage.success('语音识别已结束');
  };
} else {
  ElMessage.error('当前浏览器不支持语音识别（推荐使用Chrome/Edge）');
};
function startspeech(){
    if(!recognition)return 
    try{
        recognition.start()//开启识别
        ElMessage.info('已启动语音识别，请说话（说完后自动结束）');
        console.log('Ready to receive speech command');
    } catch (err) {
    ElMessage.error('启动语音识别失败：' + err.message);
  }
}
//发送消息
const store=useStore()
const aiReply = ref('');
let currentEventSource = null;
let aiMsgTempId = '';

async function sendmessage() {
    if (textareavalue.value === '') return;
    const userMsg = {
        message: textareavalue.value,
        sender: 1,
        id: Date.now() + Math.random().toString(36).slice(2)
    };
    store.addhistory(store.$state,userMsg); 
    textareavalue.value = ''; // 置空输入框
    console.log('已发送用户消息', store.history);
    aiMsgTempId = Date.now() + Math.random().toString(36).slice(2);
    store.addhistory(store.$state,{
        message: '', // 初始为空，后续实时追加
        sender: 2,
        id: aiMsgTempId
    });
    // 重置AI回复内容
    aiReply.value = '';

    // 4. 准备用户输入参数
    const userInput = userMsg; 
    if (!userInput) return;

    try {
        console.log('开始调用后端预存接口');
        // 调用后端预存接口
        const res = await fetch('http://localhost:3001/api/save-input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput: userInput })
        });

        // 5. 校验后端响应是否成功
        if (!res.ok) {
            throw new Error(`后端预存接口返回错误：${res.status} ${res.statusText}`);
        }

        // 解析会话ID
        const { sessionId } = await res.json();
        // 6. 校验sessionId有效性
        if (!sessionId) {
            throw new Error('后端未返回有效会话ID');
        }
        console.log('获取到会话ID：', sessionId);

        // 7. 关闭上一次的SSE连接（避免多连接冲突）
        if (currentEventSource) {
            currentEventSource.close();
        }

        // 8. 创建SSE连接
        const sseUrl = `http://localhost:3001/api/chat/sse?sessionId=${sessionId}`;
        currentEventSource = new EventSource(sseUrl);

        // 9. 监听SSE消息（核心：实时更新AI回复）
        currentEventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('收到SSE数据：', data); // 新增日志，确认数据接收

                // 处理后端返回的错误
                if (data.error) {
                    aiReply.value = `AI回复失败：${data.error}`;
                    // 更新历史中的AI错误消息
                    store.updateAiMsgInHistory(store.$state,aiReply.value);
                    currentEventSource.close();
                    return;
                }

                // 实时追加回复片段
                if (data.replyChunk) {
                    aiReply.value += data.replyChunk;
                    console.log('实时回复片段：', data.replyChunk);
                    store.updateAiMsgInHistory(store.$state,aiReply.value);
                }

                if (data.status === 'done') {
                    currentEventSource.close();
                    currentEventSource = null;
                    console.log('回复完成：', aiReply.value);
                }
            } catch (parseErr) {
                console.error('解析SSE数据失败：', parseErr);
                aiReply.value = '解析AI回复失败';
                 store.updateAiMsgInHistory(store.$state,aiReply.value);
                currentEventSource.close();
            }
        };

        // 10. 监听SSE错误
        currentEventSource.onerror = (err) => {
            console.error('SSE错误状态:', currentEventSource.readyState);
            console.error('SSE错误详情:', err, err.message);
            aiReply.value = 'SSE连接失败，请检查后端服务是否启动';
            // 更新历史中的AI错误消息
            store.updateAiMsgInHistory(store.$state,aiReply.value);
            currentEventSource.close();
            currentEventSource = null;
        };

    } catch (err) {
        aiReply.value = `请求失败：${err.message}`;
        console.error('请求总失败:', err);
        // 错误消息添加到历史
        store.addhistory({
            message: aiReply.value,
            sender: 2,
            id: Date.now() + Math.random().toString(36).slice(2)
        });
    }
}

onUnmounted(
    ()=>{
        if(recognition||recognition.stop)
    {
        recognition.stop();
    }
    }
)
</script>

<style lang="css" scoped>
.foot{
    height: 150px;
    color: black;
    margin-left: 220px;
    margin-right: 220px;
    margin-bottom: 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.text{
width: 100%;

flex: 1;
}
.bottom{
width: 100%;
height: 50px;
background-color: rgba(0, 0, 0, 0.005);
display: flex;
justify-content: end;
align-items: end;
}
.micro,.cut{
 margin-right: 20px;
 width: 30px;
 height: 30px;
 background-color: rgba(0, 0, 0, 0.005);
 display: flex;
 justify-content: center;
 align-items: center;
 cursor: pointer;
}
.micro:hover{
    background-color: rgba(0, 0, 0, 0.1);
}
.cut:hover{
    background-color: rgba(0, 0, 0, 0.1);   
}
.send{
 margin-right: 20px;
 width: 40px;
 height: 40px;
 background-color: rgba(0, 0, 0, 0.1);
 border-radius: 20px;
 display: flex;
 justify-content: center;
 align-items: center;
 font-size: 30px;
 color: white;
}
.active{
    background-color: rgba(12, 105, 227, 0.937);
}
.input_text{
    border: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.005);
    overflow-y: hidden;
    resize: none;
    color: rgba(0, 0, 0, 0.0.2);
    font-size: 20px;
}
.input_text::placeholder {
  color: rgba(0, 0, 0, 0.0.2); /* 浅灰色，清晰可见又不突兀 */
  opacity: 1;  /* 强制不透明，部分浏览器默认0.5 */
  font-size: 20px;
}
.input_text:focus{
    border: 0px;
    outline: none;
}
</style>