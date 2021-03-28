import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const DynamicSimpleMDE = (props) => {
	return (
		<SimpleMDE
			{...props}
			options={{
				hideIcons: ['guide', 'fullscreen', 'side-by-side'],
				showIcons: ['code', 'table'],
			}}
		/>
	);
};

export default DynamicSimpleMDE;
