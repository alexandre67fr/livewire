/**
 * I don't want to look at "value" attributes when diffing.
 * I commented out all the lines that compare "value"
 *
 */

export default function morphAttrs(fromNode, toNode) {
    // if (fromNode._x_is_shown !== undefined && toNode._x_is_shown !== undefined) return
    // if (fromNode._x_is_shown && ! toNode._x_is_shown) {
    //     console.log('skip attrs');
    //     return
    //     // fromNode._x_hide()
    // }
    // if (! fromNode._x_is_shown && toNode._x_is_shown) {
    //     return
    //     // fromNode._x_show()
    // }

    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // update attributes on original DOM element
    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    attrs = fromNode.attributes;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;

                if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                    fromNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!toNode.hasAttribute(attrName)) {
                    fromNode.removeAttribute(attrName);
                }
            }
        }
    }
}
