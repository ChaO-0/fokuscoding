import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const DynamicSimpleMDE = (props) => {
	return (
		<SimpleMDE
			id="MDEEEEEEE"
			style={{}}
			{...props}
			options={{
				hideIcons: ['guide', 'fullscreen', 'side-by-side', 'preview'],
				showIcons: ['code', 'table'],
				spellChecker: false,
			}}
		/>
	);
};

export default DynamicSimpleMDE;
