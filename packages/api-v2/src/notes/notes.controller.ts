import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    create(@Body() dto: CreateNoteDto) {
        return this.notesService.create(dto);
    }

    @Get()
    findAll() {
        return this.notesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.notesService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
        return this.notesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notesService.removeById(id);
    }
}
