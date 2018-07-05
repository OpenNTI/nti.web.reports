import ContextRegistry from './ContextRegistry';
import ViewerRegistry from './ViewerRegistry';
import './course-instance';
import  './default';
import './global';
import './user';
import './contentpackage-bundle';
import './user-book-record';

export function getContext (object) {
	const Context = ContextRegistry.getInstance().getItemFor(object.MimeType);

	return new Context(object);
}

export function getContextViewer (contextID) {
	return ViewerRegistry.getInstance().getItemFor(contextID);
}
