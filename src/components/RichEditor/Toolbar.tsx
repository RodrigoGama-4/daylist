import { useSlate } from 'slate-react';

import { BiHeading } from 'react-icons/bi';
import {
  BiAlignLeft,
  BiAlignRight,
  BiAlignMiddle,
  BiAlignJustify,
} from 'react-icons/bi';
import {
  MdAudioFile,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdChecklist,
  MdAudiotrack,
  MdImage,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatItalic,
  MdFormatBold,
} from 'react-icons/md';
import { Paragraph } from './slate';
import _ from 'lodash';
import { BsCardHeading } from 'react-icons/bs';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { EditorCmd } from './Commands';

export default function Toolbar() {
  const editor = useSlate();
  const variant = 'dark';
  return (
    <ButtonToolbar>
      <ButtonGroup>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleParagraphProp(editor, { header: 1 })}
        >
          <BsCardHeading />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleMark(editor, 'bold')}
        >
          <MdFormatBold />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleMark(editor, 'italic')}
        >
          <MdFormatItalic />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleMark(editor, 'strike')}
        >
          <MdFormatStrikethrough />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleMark(editor, 'underline')}
        >
          <MdFormatUnderlined />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant={variant}
          onClick={() =>
            EditorCmd.toggleParagraphProp(editor, { align: 'left' })
          }
        >
          <BiAlignLeft />
        </Button>
        <Button
          variant={variant}
          onClick={() =>
            EditorCmd.toggleParagraphProp(editor, { align: 'center' })
          }
        >
          <BiAlignMiddle />
        </Button>
        <Button
          variant={variant}
          onClick={() =>
            EditorCmd.toggleParagraphProp(editor, { align: 'right' })
          }
        >
          <BiAlignRight />
        </Button>
        <Button
          variant={variant}
          onClick={() =>
            EditorCmd.toggleParagraphProp(editor, { align: 'justify' })
          }
        >
          <BiAlignJustify />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleBlock(editor, 'bullet-list')}
        >
          <MdFormatListBulleted />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleBlock(editor, 'number-list')}
        >
          <MdFormatListNumbered />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleBlock(editor, 'check-list')}
        >
          <MdChecklist />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleBlock(editor, 'image')}
        >
          <MdImage />
        </Button>
        <Button
          variant={variant}
          onClick={() => EditorCmd.toggleBlock(editor, 'audio')}
        >
          <MdAudiotrack />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
}
