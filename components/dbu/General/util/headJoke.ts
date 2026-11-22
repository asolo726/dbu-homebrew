const maxImageSizeBytes = 4 * 1024 * 1024;

const repeatedUploadMessages = [
	"Didn't you get the memo? The image is too big!",
	"Stop trying to upload that file! It's too many bytes!",
	"...",
	"Did you know that the definition of insanity is doing the same thing over and over again and expecting different results?",
	"What is wrong with you?",
	"You're just trying to make my site suffer, aren't you?",
	"Stop it.",
	"I'm warning you.",
	"You won't like what happens, trust me.",
	"Very well then. Perish.",
];

export class HeadJoke {
	private timesUserHasUploadedThatIsFileTooBig = 0;
	private weirdRoute = false;
	private firstAttemptMessageIndex = 0;
	private repeatedMessageIndex = 0;

	constructor(private readonly author: string) {}

	isTooBig(fileSize: number) {
		return fileSize > maxImageSizeBytes;
	}

	nextMessage(): { message: string; shouldClose: boolean } {
		if (!this.weirdRoute) {
			this.timesUserHasUploadedThatIsFileTooBig++;
			this.weirdRoute =
				Math.random() * 20 + 1 >
				20 - this.timesUserHasUploadedThatIsFileTooBig;
			const firstAttemptMessages = [
				"Hey, that file is too big! Try a smaller one. (Error: File Size above 4MB)",
				"Woah there? Are you trying to upload your mom to the site? (Error: File Size above 4MB)",
				`Sorry ${this.author}, I don't think that qualifies as a valid image (Error: File Size above 4MB)`,
				"Hey, memory isn't infinite! Try a smaller file. (Error: File Size above 4MB)",
				"Your file needs to lose some weight! (Error: File Size above 4MB)",
			];
			let index = Math.floor(Math.random() * firstAttemptMessages.length);
			if (index === this.firstAttemptMessageIndex) {
				index = (index + 1) % firstAttemptMessages.length;
			}
			this.firstAttemptMessageIndex = index;
			return { message: firstAttemptMessages[index], shouldClose: false };
		}

		const messageIndex = Math.min(
			this.repeatedMessageIndex,
			repeatedUploadMessages.length - 1,
		);
		this.repeatedMessageIndex = Math.min(
			messageIndex + 1,
			repeatedUploadMessages.length - 1,
		);
		playAudio("/audio/dragonGrave.mp3");
		return {
			message: repeatedUploadMessages[messageIndex],
			shouldClose: messageIndex === repeatedUploadMessages.length - 1,
		};
	}
}

export function playAudio(source: string) {
	const audio = new Audio(source);
	audio.playbackRate = 1.0;
	void audio.play();
}
