// Minimal JS-to-XML stringifier, implements just enough to generate DASH manifests

type Node = RootNode | ChildNode;
type ChildNode = ElementNode | TextNode;

export interface Attributes {
	[key: string]: string | number | null | undefined;
}

export interface RootNode {
	type: 'root';
	attributes: Attributes | null;
	elements: ChildNode[] | null;
}

export interface TextNode {
	type: 'text';
	value: string;
}

export interface ElementNode {
	type: 'element';
	name: string;
	attributes: Attributes | null;
	elements: ChildNode[] | null;
}

const escape = (value: string, isAttribute: boolean) => {
	const str = '' + value;

	let escaped = '';
	let last = 0;

	for (let idx = 0, len = str.length; idx < len; idx++) {
		const char = str.charCodeAt(idx);

		if (char === 38 || char === (isAttribute ? 34 : 60)) {
			escaped += str.substring(last, idx) + ('&#' + char + ';');
			last = idx + 1;
		}
	}

	if (last === 0) {
		return str;
	}

	return escaped + str.substring(last);
};

const writeAttributes = (attrs: Attributes | null) => {
	let str = '';

	for (const key in attrs) {
		const val = attrs[key];

		if (val != null) {
			str += ' ' + key + '="' + escape('' + val, true) + '"';
		}
	}

	return str;
};

const writeRoot = (node: RootNode) => {
	return '<?xml' + writeAttributes(node.attributes) + '?>' + writeChildNodes(node.elements);
};

const writeText = (node: TextNode) => {
	return escape(node.value, false);
};

const writeElement = (node: ElementNode) => {
	const name = node.name;
	return (
		'<' + name + writeAttributes(node.attributes) + '>' + writeChildNodes(node.elements) + '</' + name + '>'
	);
};

const writeChildNodes = (nodes: ChildNode[] | null) => {
	let str = '';

	if (nodes !== null) {
		for (let idx = 0, len = nodes.length; idx < len; idx++) {
			const node = nodes[idx];
			str += writeChildNode(node);
		}
	}

	return str;
};

const writeChildNode = (node: ChildNode) => {
	switch (node.type) {
		case 'text':
			return writeText(node);
		case 'element':
			return writeElement(node);
	}
};

const writeNode = (node: Node) => {
	switch (node.type) {
		case 'root':
			return writeRoot(node);
		default:
			return writeChildNode(node);
	}
};

export { writeNode as writeXml };
