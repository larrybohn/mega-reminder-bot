export function extractMessageSummary(msg) {
    if (msg.text) {
        return msg.text;
    }
    if (msg.sticker) {
        return msg.sticker.emoji;
    }
    if (msg.voice) {
        return `Voice message (${msg.voice.duration} seconds)`;
    }
    if (msg.video_note) {
        return `Video message (${msg.video_note.duration} seconds)`;
    }
    if (msg.location) {
        return `Location`; //latitude, longitude
    }
    let contentDescription = '';
    if (msg.document) {
        contentDescription = msg.document.file_name;
    }else if (msg.audio) {
        contentDescription = `${msg.audio.performer} - ${msg.audio.title}`;
    }else if (msg.video) {
        contentDescription = 'Video';
    }else if (msg.photo) {
        contentDescription = 'Photo';
    }else{
        contentDescription = 'Unrecognized content';
    }

    if (msg.caption) {
        return `${msg.caption} (${contentDescription})`;
    }else{
        return contentDescription;
    }
}