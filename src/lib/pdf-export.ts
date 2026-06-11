import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Tournament, Round } from './types';
import { computeLeaderboard } from './round-robin';

export function exportTournamentPDF(tournament: Tournament): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ─── Header ─────────────────────────────────────────────────────────────
  doc.setFillColor(9, 22, 74); // primary-container
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Rockii Pickleball', 14, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(tournament.config.name, 14, 28);

  // Tournament info
  const dateStr = new Date(tournament.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setTextColor(186, 174, 0); // tertiary-container gold
  doc.setFontSize(10);
  doc.text(dateStr, pageWidth - 14, 18, { align: 'right' });

  const modeText = `${tournament.config.mode === 'doubles' ? 'Doubles' : 'Singles'} • ${tournament.players.length} Players • ${tournament.config.numberOfCourts} Courts`;
  doc.text(modeText, pageWidth - 14, 26, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  let yPos = 45;

  // ─── Round Schedules ────────────────────────────────────────────────────
  for (const round of tournament.rounds) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(9, 22, 74);
    doc.text(`Round ${round.roundNumber}`, 14, yPos);
    yPos += 4;

    const tableData = round.matches.map((match) => {
      const team1Names = match.team1.map((p) => p.name).join(' & ');
      const team2Names = match.team2.map((p) => p.name).join(' & ');
      const score =
        match.score1 !== null && match.score2 !== null
          ? `${match.score1} - ${match.score2}`
          : '— vs —';
      return [`Game ${match.matchNumber}`, team1Names, score, team2Names, `Court ${match.court}`];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Game', 'Team 1', 'Score', 'Team 2', 'Court']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 22, 74],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 50, halign: 'left' },
        2: { cellWidth: 28 },
        3: { cellWidth: 50, halign: 'right' },
        4: { cellWidth: 22 },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 243],
      },
      margin: { left: 14, right: 14 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPos = (doc as any).lastAutoTable.finalY + 12;
  }

  // ─── Leaderboard ────────────────────────────────────────────────────────
  const leaderboard = computeLeaderboard(tournament.players, tournament.rounds);
  const hasResults = leaderboard.some((s) => s.gamesPlayed > 0);

  if (hasResults) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(9, 22, 74);
    doc.text('Leaderboard', 14, yPos);
    yPos += 4;

    const lbData = leaderboard.map((s, i) => [
      `${i + 1}`,
      s.player.name,
      `${s.wins}`,
      `${s.losses}`,
      `${s.pointsFor}`,
      `${s.pointsAgainst}`,
      `${s.pointsFor - s.pointsAgainst}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Player', 'W', 'L', 'PF', 'PA', '+/-']],
      body: lbData,
      theme: 'grid',
      headStyles: {
        fillColor: [9, 22, 74],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 50, halign: 'left' },
      },
      alternateRowStyles: {
        fillColor: [250, 250, 243],
      },
      margin: { left: 14, right: 14 },
    });
  }

  // ─── Footer ─────────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Rockii Pickleball • Generated ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  doc.save(`${tournament.config.name.replace(/\s+/g, '_')}_schedule.pdf`);
}
