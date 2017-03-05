/*
 * Copyright (C) 2016, 2017 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = function (Marca) {
	Marca.DOMElementHypertext = Object.create(Marca.DOMElement);
	Marca.DOMElementHypertext.name = "hypertext";
	Marca.DOMElementHypertext.preformatted = false;
	Marca.DOMElementHypertext.initContent = function (node) {
		var ta = Marca.DOMElement.initContent.call(this, node);

		this.id = node.attributes.id;
		if (node.attributes.class) {
			var s = node.attributes.class.trim();
			this.class = s ? s.split(/\s+/) : undefined;
		} else
			this.class = undefined;

		if (this.preformatted)
			return ta;

		var prevChild, child, nextChild;
		var prevChildIsText, childIsText, nextChildIsText;
		var prevChildInline, childInline, nextChildInline;
		var deleted = false;
		for (var i = 0; i <= this.children.length; i++) {
			if (!deleted) {
				prevChild = child;
				prevChildIsText = childIsText;
				prevChildInline = childInline;
			}
			deleted = false;
			child = nextChild;
			childIsText = nextChildIsText;
			childInline = nextChildInline;
			nextChild = this.children[i];
			nextChildIsText =
				Marca.DOMElementText.isPrototypeOf(nextChild);
			nextChildInline =
				Marca.DOMElementHypertextInline
				     .isPrototypeOf(nextChild)
				|| nextChildIsText;

			if (!childIsText)
				continue;

			child.text = child.text.replace(/\s+/g, " ");
			if (!prevChildInline
			    || (prevChildIsText && /\s$/.test(prevChild.text)))
				child.text = child.text.replace(/^\s+/, "");
			if (!nextChildInline
			    || (nextChildIsText && /^\s/.test(nextChild.text)))
				child.text = child.text.replace(/\s+$/, "");
			if (child.text == "") {
				i--;
				this.children.splice(i, 1);
				deleted = true;

				for (var j = 0; j < ta.length; j++)
					if (ta[j].position > i)
						ta[j].position--;
			}
		}

		return ta;
	};

	Marca.DOMElementHypertextFlow =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextFlow.name = "flow";

	Marca.DOMElementHypertextBlock =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextBlock.name = "block";
	Marca.DOMElementHypertextBlock.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextInline
				  .isPrototypeOf(this.children[i])
			    && !Marca.DOMElementText
				     .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      + "text and inline elements";

		return ta;
	};

	Marca.DOMElementHypertextInline =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextInline.name = "inline";
	Marca.DOMElementHypertextInline.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextInline
				  .isPrototypeOf(this.children[i])
			    && !Marca.DOMElementText
				     .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      "text and inline elements";

		return ta;
	};

	Marca.DOMElementHypertextRoot =
		Object.create(Marca.DOMElementHypertextFlow);
	Marca.DOMElementHypertextRoot.name = "hypertext root";

	Marca.DOMElementHypertextList =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextList.name = "list";
	Marca.DOMElementHypertextList.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextListItem
				  .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      + "list item elements";

		return ta;
	};

	Marca.DOMElementHypertextHeading =
		Object.create(Marca.DOMElementHypertextBlock);
	Marca.DOMElementHypertextHeading.name = "heading";

	Marca.DOMElementHypertextHeading1 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading1.name = "heading level 1";
	Marca.DOMElementHypertextHeading1.level = 1;
	Marca.DOMElementHypertextHeading2 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading2.name = "heading level 2";
	Marca.DOMElementHypertextHeading2.level = 2;
	Marca.DOMElementHypertextHeading3 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading3.name = "heading level 3";
	Marca.DOMElementHypertextHeading3.level = 3;
	Marca.DOMElementHypertextHeading4 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading4.name = "heading level 4";
	Marca.DOMElementHypertextHeading4.level = 4;
	Marca.DOMElementHypertextHeading5 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading5.name = "heading level 5";
	Marca.DOMElementHypertextHeading5.level = 5;
	Marca.DOMElementHypertextHeading6 =
		Object.create(Marca.DOMElementHypertextHeading);
	Marca.DOMElementHypertextHeading6.name = "heading level 6";
	Marca.DOMElementHypertextHeading6.level = 6;

	Marca.DOMElementHypertextParagraph =
		Object.create(Marca.DOMElementHypertextBlock);
	Marca.DOMElementHypertextParagraph.name = "paragraph";

	Marca.DOMElementHypertextFigure =
		Object.create(Marca.DOMElementHypertextBlock);
	Marca.DOMElementHypertextFigure.name = "figure";
	Marca.DOMElementHypertextFigure.initContent = function (node) {
		var ta = Marca.DOMElementHypertextBlock.initContent
			      .call(this, node);

		if (!("src" in node.attributes))
			throw this.name + " element without src attribute";
		this.src = node.attributes.src;
		if ("alt" in node.attributes)
			this.alt = node.attributes.alt;

		return ta;
	};

	Marca.DOMElementHypertextOrderedList =
		Object.create(Marca.DOMElementHypertextList);
	Marca.DOMElementHypertextOrderedList.name = "ordered list";
	Marca.DOMElementHypertextUnorderedList =
		Object.create(Marca.DOMElementHypertextList);
	Marca.DOMElementHypertextUnorderedList.name = "unordered list";

	Marca.DOMElementHypertextListItem =
		Object.create(Marca.DOMElementHypertextFlow);
	Marca.DOMElementHypertextListItem.name = "list item";

	Marca.DOMElementHypertextBlockQuotation =
		Object.create(Marca.DOMElementHypertextFlow);
	Marca.DOMElementHypertextBlockQuotation.name = "block quotation";

	Marca.DOMElementHypertextTable =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextTable.name = "table";
	Marca.DOMElementHypertextTable.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextTableSection
				  .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      + "table section elements";

		return ta;
	};

	Marca.DOMElementHypertextTableSection =
		Object.create(Marca.DOMElementHypertext);
	Marca.DOMElementHypertextTableSection.name = "table section";
	Marca.DOMElementHypertextTableSection.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextTableRow
				  .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      + "table row elements";

		return ta;
	};

	Marca.DOMElementHypertextTableHead =
		Object.create(Marca.DOMElementHypertextTableSection);
	Marca.DOMElementHypertextTableHead.name = "table head";
	Marca.DOMElementHypertextTableBody =
		Object.create(Marca.DOMElementHypertextTableSection);
	Marca.DOMElementHypertextTableBody.name = "table body";
	Marca.DOMElementHypertextTableFoot =
		Object.create(Marca.DOMElementHypertextTableSection);
	Marca.DOMElementHypertextTableFoot.name = "table foot";

	Marca.DOMElementHypertextTableRow =
		Object.create(Marca.DOMElementHypertextTableSection);
	Marca.DOMElementHypertextTableRow.name = "table row";
	Marca.DOMElementHypertextTableRow.initContent = function (node) {
		var ta = Marca.DOMElementHypertext.initContent.call(this, node);

		for (var i = 0; i < this.children.length; i++)
			if (!Marca.DOMElementHypertextTableCell
				  .isPrototypeOf(this.children[i]))
				throw this.name + " element can only contain "
				      + "table cell elements";

		return ta;
	};

	Marca.DOMElementHypertextTableCell =
		Object.create(Marca.DOMElementHypertextFlow);
	Marca.DOMElementHypertextTableCell.name = "table cell";

	Marca.DOMElementHypertextSpan =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextSpan.name = "span";

	Marca.DOMElementHypertextAnchor =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextAnchor.name = "anchor";
	Marca.DOMElementHypertextAnchor.initContent = function (node) {
		var ta = Marca.DOMElementHypertextInline.initContent
			      .call(this, node);

		if (!("href" in node.attributes))
			throw this.name + " element without href attribute";
		this.href = node.attributes.href;

		return ta;
	};

	Marca.DOMElementHypertextStrong =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextStrong.name = "strong";
	Marca.DOMElementHypertextEmphasis =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextEmphasis.name = "emphasis";
	Marca.DOMElementHypertextDeleted =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextDeleted.name = "deleted text";
	Marca.DOMElementHypertextSubscript =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextSubscript.name = "subscript";
	Marca.DOMElementHypertextSuperscript =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextSuperscript.name = "superscript";
	Marca.DOMElementHypertextCode =
		Object.create(Marca.DOMElementHypertextInline);
	Marca.DOMElementHypertextCode.name = "code";

	Marca.DOMElementHypertextPreformatted =
		Object.create(Marca.DOMElementHypertextBlock);
	Marca.DOMElementHypertextPreformatted.name = "preformatted text";
	Marca.DOMElementHypertextPreformatted.preformatted = true;
	Marca.DOMElementHypertextPreformatted.pushAttrs =
		{ preformatted: true };

	Marca.DOMElementHypertextBlockPassthrough =
		Object.create(Marca.DOMElementHypertextBlock);
	Marca.DOMElementHypertextBlockPassthrough.name = "passthrough block";
	Marca.DOMElementHypertextBlockPassthrough.initContent = function (node)
	{
		Marca.DOMElementTextOnly.initContent.call(this, node);

		if (!("output" in node.attributes))
			throw this.name + " element without output attribute";

		this.output = node.attributes.output;
		return [];
	};

	Marca.HypertextElementProtos = {
		h1:		Marca.DOMElementHypertextHeading1,
		h2:		Marca.DOMElementHypertextHeading2,
		h3:		Marca.DOMElementHypertextHeading3,
		h4:		Marca.DOMElementHypertextHeading4,
		h5:		Marca.DOMElementHypertextHeading5,
		h6:		Marca.DOMElementHypertextHeading6,
		p:		Marca.DOMElementHypertextParagraph,
		figure:		Marca.DOMElementHypertextFigure,
		ol:		Marca.DOMElementHypertextOrderedList,
		ul:		Marca.DOMElementHypertextUnorderedList,
		li:		Marca.DOMElementHypertextListItem,
		blockquote:	Marca.DOMElementHypertextBlockQuotation,
		table:		Marca.DOMElementHypertextTable,
		thead:		Marca.DOMElementHypertextTableHead,
		tbody:		Marca.DOMElementHypertextTableBody,
		tfoot:		Marca.DOMElementHypertextTableFoot,
		tr:		Marca.DOMElementHypertextTableRow,
		td:		Marca.DOMElementHypertextTableCell,
		span:		Marca.DOMElementHypertextSpan,
		a:		Marca.DOMElementHypertextAnchor,
		strong:		Marca.DOMElementHypertextStrong,
		em:		Marca.DOMElementHypertextEmphasis,
		del:		Marca.DOMElementHypertextDeleted,
		sub:		Marca.DOMElementHypertextSubscript,
		sup:		Marca.DOMElementHypertextSuperscript,
		code:		Marca.DOMElementHypertextCode,
		pre:		Marca.DOMElementHypertextPreformatted,
		blockpt:	Marca.DOMElementHypertextBlockPassthrough
	};
};
