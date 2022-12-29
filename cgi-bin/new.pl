#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;

my $q = CGI->new;
print $q->header('text/xml;charset=UTF-8');

my @row;
my $title = $q->param('title');
my $owner = $q->param('owner');
my $text = $q->param('text');

if(defined($title) and defined($owner) and defined($text)){
  if(checkOwner($owner)){
    InsertArticles($title,$owner,$text);
    successInsert($title, $text);
  }else{
    showNew();
  }
}else{
  showNew();
}

sub InsertArticles{
  my $titleQuery = $_[0];
  my $ownerQuery = $_[1];
  my $textQuery = $_[2];

  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

  my $sql = "INSERT INTO Articles VALUES (?,?,?)";
  my $sth = $dbh->prepare($sql);
  $sth->execute($titleQuery, $ownerQuery, $textQuery);
  $sth->finish;
  $dbh->disconnect;
}

sub checkOwner{
  my $ownerQuery = $_[0];

  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=localhost';
  my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");

  my $sql = "SELECT * FROM Users WHERE userName=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($ownerQuery);
  @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
}

sub successInsert{
  my $titleQuery = $_[0];
  my $textQuery = $_[1];
  
  print <<XML;
  <article>
    <title>$titleQuery</title>
    <text>$textQuery</text>
  </article>
XML
}

sub showNew{
print <<XML;
<article>
</article>
XML
}

