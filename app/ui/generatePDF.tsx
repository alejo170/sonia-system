'use client';

import { Button } from '@/app/ui/button';
import { jsPDF } from 'jspdf';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Note } from '@/app/lib/definitions';
import logo from '@/public/logoPDF.png';

export default function generatePDF({ notes }: { notes: Note[] }) {
  const elapsedTime = Date.now();
  const today = new Date(elapsedTime);

  const generarPdf = () => {
    const doc = new jsPDF();
    //Encabezado del boletin de notas
    const imgData = logo.src;
    doc.addImage(imgData, 'PNG', 10, 1, 50, 50);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'italic');
    doc.text('Sistema Optimizado para Notas e Información Académica', 80, 25);
    doc.text(`Fecha: ${today.toLocaleDateString()}`, 10, 50);
    doc.text(`Nombre del estudiante: ${notes[0]?.user_name || ''}`, 10, 60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Boletin de notas', 85, 75);
    // Generar la tabla de notas
    let y = 88;
    doc.setFontSize(12); // Tamaño de fuente para los datos de la tabla
    doc.setDrawColor(122, 125, 255); // Establecer el color de la línea
    doc.setLineWidth(1); // Grosor de línea para la tabla
    doc.line(10, 78, 200, 78);
    // Encabezados de la tabla
    doc.text('Asignatura', 10, y);
    doc.text('Nota Corte 1', 50, y);
    doc.text('Nota Corte 2', 90, y);
    doc.text('Nota final', 170, y);
    // Contenido de la tabla
    doc.setFont('helvetica', 'normal');
    y += 10; // Incrementar la posición Y para el contenido de la tabla
    notes.forEach((note, index) => {
      doc.text(note.subject_name, 10, y + index * 10);
      doc.text(note.period_1.toString(), 50, y + index * 10);
      doc.text(note.period_2.toString(), 90, y + index * 10);
      doc.text(note.final.toString(), 170, y + index * 10);
    });

    //Guardar el PDF con un nombre especifico
    doc.save('boletin.pdf');
  };

  return (
    <Button onClick={generarPdf}>
      Descargar Notas
      <ArrowDownTrayIcon className="h-5 md:ml-4" />
    </Button>
  );
}
